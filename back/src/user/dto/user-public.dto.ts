export class UserPublic {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  institutionId: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
