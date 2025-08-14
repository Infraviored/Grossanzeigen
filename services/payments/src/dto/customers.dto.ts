import { IsEmail, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class InitCustomerDto {
  @IsUUID()
  userId!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;
}


