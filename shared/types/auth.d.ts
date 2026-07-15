// Shape of the sealed-cookie session that nuxt-auth-utils manages for us.
// No database: the Spotify tokens live here, encrypted, and nowhere else.
declare module '#auth-utils' {
  interface User {
    id?: string
    name?: string
  }

  interface UserSession {
    spotify?: {
      accessToken: string
      refreshToken: string
      expiresAt: number // epoch ms
    }
  }
}

export {}
