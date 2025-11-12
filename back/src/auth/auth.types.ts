export interface AppJwtPayload {
  sub: string;
  email: string;
  institutionId: number;
  rtv: number;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
