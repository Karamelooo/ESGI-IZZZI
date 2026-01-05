import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFreeSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  plan: string;
}
