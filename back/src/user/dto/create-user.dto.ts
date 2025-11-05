export class CreateUserDto {
  email: string;
  password: string;
  name?: string | null;
  role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
  isEmailVerified?: boolean;
}
