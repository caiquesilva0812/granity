import { Injectable } from '@nestjs/common';
import { AppRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CompanyResponseDto } from './dto/company-response.dto';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUser(userId: string): Promise<CompanyResponseDto[]> {
    const companies = await this.prisma.company.findMany({
      where:   { employees: { some: { userId } } },
      orderBy: { name: 'asc' },
    });

    return companies.map((c) => new CompanyResponseDto(c));
  }

  async create(userId: string, dto: CreateCompanyDto): Promise<CompanyResponseDto> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

    const company = await this.prisma.company.create({
      data: {
        name:    dto.name,
        cnpj:    dto.cnpj,
        address: dto.address,
        type:    dto.type,
        employees: {
          create: {
            userId,
            name:    user.email.split('@')[0],
            appRole: AppRole.GESTOR,
          },
        },
      },
    });

    return new CompanyResponseDto(company);
  }
}
