import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  plan: string;

  @IsString()
  @IsNotEmpty()
  billingPeriod: string;

  @IsString()
  @IsNotEmpty()
  paymentIntentId: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsInt()
  @IsNotEmpty()
  numberOfClasses: number;
    
}
