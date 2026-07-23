// Shape of the sealed-cookie session that nuxt-auth-utils manages for us.
// No database: the provider tokens live here, encrypted, and nowhere else.
declare module '#auth-utils' {
  interface User {
    id?: string;
    name?: string;
  }

  interface UserSession {
    spotify?: {
      name?: string;
      accessToken: string;
      refreshToken: string;
      expiresAt: number; // epoch ms
      scope?: string; // space-separated scopes actually granted
    };
    deezer?: {
      name?: string;
      accessToken: string;
      expiresAt: number; // epoch ms (far future when Deezer returns expires=0)
    };
  }
}

export {};
