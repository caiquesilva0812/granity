import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

export class CreateBlockDto {
  @IsString()
  @MinLength(1)
  code: string;

  @IsNumber()
  @Min(0.01)
  c: number;

  @IsNumber()
  @Min(0.01)
  l: number;

  @IsNumber()
  @Min(0.01)
  a: number;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  cNet?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  lNet?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  aNet?: number;

  @IsOptional()
  @IsUUID()
  materialTypeId?: string;

  @IsOptional()
  @IsUUID()
  materialClassificationId?: string;

  @IsOptional()
  @IsString()
  extractionFront?: string;

  @IsOptional()
  @IsDateString()
  extractedAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
