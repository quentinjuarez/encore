import { randomBytes, timingSafeEqual } from 'node:crypto';

// Deezer OAuth. Deezer is not a built-in nuxt-auth-utils provider and its flow
// is non-standard (perms, not scope; token via access_token.php), so we drive
// it by hand, including our own `state` for CSRF protection, and stash the token
// in the sealed session.
export default defineEventHandler(async (event) => {
  const { deezer } = useRuntimeConfig(event) as unknown as {
    deezer: { appId: string; secret: string };
  };
  const query = getQuery(event);
  const requestUrl = getRequestURL(event);
  const redirectUri = `${requestUrl.origin}/auth/deezer`;

  if (!deezer.appId || !deezer.secret) {
    console.error('Deezer OAuth: app id/secret not configured');
    return sendRedirect(event, '/?auth=failed');
  }

  // User declined on Deezer's consent screen.
  if (query.error_reason) {
    return sendRedirect(event, '/?auth=failed');
  }

  // Step 1: no code yet -> mint a state, remember it, send the user to consent.
  if (!query.code) {
    const state = randomBytes(32).toString('base64url');
    setCookie(event, 'deezer_oauth_state', state, {
      httpOnly: true,
      sameSite: 'lax',
      secure: requestUrl.protocol === 'https:',
      maxAge: 600,
      path: '/',
    });
    const params = new URLSearchParams({
      app_id: deezer.appId,
      redirect_uri: redirectUri,
      perms: 'basic_access,manage_library',
      state,
    });
    return sendRedirect(event, `https://connect.deezer.com/oauth/auth.php?${params.toString()}`);
  }

  // Step 2: verify state (single-use) before trusting the callback.
  const expectedState = getCookie(event, 'deezer_oauth_state');
  deleteCookie(event, 'deezer_oauth_state');
  if (!expectedState || typeof query.state !== 'string' || !safeEqual(expectedState, query.state)) {
    return sendRedirect(event, '/?auth=failed');
  }

  // Exchange the code for an access token.
  try {
    const tokens = await $fetch<{ access_token?: string; expires?: number }>(
      'https://connect.deezer.com/oauth/access_token.php',
      { query: { app_id: deezer.appId, secret: deezer.secret, code: query.code, output: 'json' } },
    );
    if (!tokens?.access_token) {
      return sendRedirect(event, '/?auth=failed');
    }

    const me = await $fetch<{ name?: string }>('https://api.deezer.com/user/me', {
      query: { access_token: tokens.access_token },
    });

    const expires = Number(tokens.expires) || 0;
    const YEAR = 1000 * 60 * 60 * 24 * 365;
    await setUserSession(event, {
      user: { name: me?.name },
      deezer: {
        name: me?.name,
        accessToken: tokens.access_token,
        expiresAt: expires > 0 ? Date.now() + expires * 1000 : Date.now() + YEAR,
      },
    });

    const redirect = getCookie(event, 'encore_redirect') || '/';
    deleteCookie(event, 'encore_redirect');
    return sendRedirect(event, redirect);
  } catch (err) {
    console.error('Deezer OAuth error:', err);
    return sendRedirect(event, '/?auth=failed');
  }
});

// Constant-time string comparison for the OAuth state token.
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}
