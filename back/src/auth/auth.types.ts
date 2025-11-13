export type AppJwtPayload = {
  sub: string;
  email: string;
  institutionId: number;
  refreshTokenVersion: number;
  authzVersion: number;
  roles: string[];
  permissions: string[];
};

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
