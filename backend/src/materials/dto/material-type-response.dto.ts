import { Currency, MaterialClassification, MaterialType } from '@prisma/client';

class ClassificationResponseDto {
  id:        string;
  name:      string;
  price:     number;
  currency:  Currency;
  createdAt: Date;
  updatedAt: Date;

  constructor(cls: MaterialClassification) {
    this.id        = cls.id;
    this.name      = cls.name;
    this.price     = Number(cls.price);
    this.currency  = cls.currency;
    this.createdAt = cls.createdAt;
    this.updatedAt = cls.updatedAt;
  }
}

type MaterialTypeWithClassifications = MaterialType & {
  classifications: MaterialClassification[];
};

export class MaterialTypeResponseDto {
  id:              string;
  name:            string;
  description:     string | null;
  createdAt:       Date;
  classifications: ClassificationResponseDto[];

  constructor(type: MaterialTypeWithClassifications) {
    this.id              = type.id;
    this.name            = type.name;
    this.description     = type.description;
    this.createdAt       = type.createdAt;
    this.classifications = type.classifications.map((c) => new ClassificationResponseDto(c));
  }
}
