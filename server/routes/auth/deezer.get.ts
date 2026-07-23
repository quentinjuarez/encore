// Deezer OAuth. Deezer is not a built-in nuxt-auth-utils provider and its flow
// is non-standard (perms, not scope; token via access_token.php), so we drive
// it by hand and stash the token in the sealed session.
export default defineEventHandler(async (event) => {
  const { deezer } = useRuntimeConfig(event) as unknown as {
    deezer: { appId: string; secret: string };
  };
  const query = getQuery(event);
  const redirectUri = `${getRequestURL(event).origin}/auth/deezer`;

  if (!deezer.appId || !deezer.secret) {
    console.error('Deezer OAuth: app id/secret not configured');
    return sendRedirect(event, '/?auth=failed');
  }

  // User declined on Deezer's consent screen.
  if (query.error_reason) {
    return sendRedirect(event, '/?auth=failed');
  }

  // Step 1: no code yet -> send the user to Deezer's consent screen.
  if (!query.code) {
    const params = new URLSearchParams({
      app_id: deezer.appId,
      redirect_uri: redirectUri,
      perms: 'basic_access,manage_library',
    });
    return sendRedirect(event, `https://connect.deezer.com/oauth/auth.php?${params.toString()}`);
  }

  // Step 2: exchange the code for an access token.
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
