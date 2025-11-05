export class UpdateUserDto {
  email?: string;
  password?: string;
  name?: string | null;
  role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
  isEmailVerified?: boolean;
}
