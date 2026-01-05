import { IsString } from 'class-validator';

export class RefreshDto {
  @IsString({ message: 'Refresh token invalide' })
  refreshToken: string;
}
