import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateMaterialTypeDto {
  @IsString()
  @MinLength(2, { message: 'Nome deve ter no mínimo 2 caracteres.' })
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
