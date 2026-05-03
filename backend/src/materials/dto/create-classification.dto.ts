import { Currency } from '@prisma/client';
import { IsEnum, IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateClassificationDto {
  @IsString()
  @MinLength(2, { message: 'Nome deve ter no mínimo 2 caracteres.' })
  name: string;

  @IsNumber({}, { message: 'Preço deve ser um número.' })
  @Min(0.01, { message: 'Preço deve ser maior que zero.' })
  price: number;

  @IsEnum(Currency, { message: 'Moeda deve ser USD ou BRL.' })
  currency: Currency;
}
