import { IsEmail, IsIn, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateConnectAccountDto {
  @IsUUID()
  userId!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @Length(2, 2)
  country?: string; // ISO 3166-1 alpha-2, e.g., 'US'

  @IsOptional()
  @IsIn(['individual', 'company'])
  businessType?: 'individual' | 'company';
}

export class CreateOnboardingLinkDto {
  @IsString()
  accountId!: string;
}


