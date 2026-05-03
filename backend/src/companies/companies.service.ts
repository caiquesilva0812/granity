import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompanyResponseDto } from './dto/company-response.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUser(userId: string): Promise<CompanyResponseDto[]> {
    const companies = await this.prisma.company.findMany({
      where: {
        employees: { some: { userId } },
      },
      orderBy: { name: 'asc' },
    });

    return companies.map((c) => new CompanyResponseDto(c));
  }
}
