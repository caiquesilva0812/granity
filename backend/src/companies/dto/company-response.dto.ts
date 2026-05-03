import { Company, CompanyType } from '@prisma/client';

export class CompanyResponseDto {
  id:        string;
  name:      string;
  cnpj:      string;
  address:   string | null;
  type:      CompanyType;
  createdAt: Date;

  constructor(company: Company) {
    this.id        = company.id;
    this.name      = company.name;
    this.cnpj      = company.cnpj;
    this.address   = company.address;
    this.type      = company.type;
    this.createdAt = company.createdAt;
  }
}
