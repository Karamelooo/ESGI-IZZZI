export class UserPublic {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  hashedRefreshToken?: string | null;
  institutionId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
