import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { CompanyType } from '@prisma/client';

export class CreateCompanyDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(14)
  cnpj: string;

  @IsEnum(CompanyType)
  type: CompanyType;

  @IsOptional()
  @IsString()
  address?: string;
}
