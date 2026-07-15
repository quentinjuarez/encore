// Spotify OAuth. nuxt-auth-utils handles the redirect dance; we just stash the
// tokens in the sealed session and bounce the user back where they started.
export default defineOAuthSpotifyEventHandler({
  config: {
    scope: ['playlist-modify-public', 'playlist-modify-private', 'user-read-private'],
    // Always show the consent screen so a reconnect refreshes the granted
    // scopes (a refreshed token never gains scopes the grant didn't include).
    authorizationParams: { show_dialog: 'true' },
  },
  async onSuccess(event, { user, tokens }) {
    await setUserSession(event, {
      user: { id: user.id, name: user.display_name },
      spotify: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: Date.now() + tokens.expires_in * 1000,
      },
    })

    const redirect = getCookie(event, 'encore_redirect') || '/'
    deleteCookie(event, 'encore_redirect')
    return sendRedirect(event, redirect)
  },
  onError(event, error) {
    console.error('Spotify OAuth error:', error)
    return sendRedirect(event, '/?auth=failed')
  },
})
