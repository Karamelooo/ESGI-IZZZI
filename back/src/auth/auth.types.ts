export interface AppJwtPayload {
  sub: string;
  email: string;
  institutionId: number;
  refreshTokenVersion: number;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
