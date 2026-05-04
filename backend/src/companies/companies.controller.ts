import { Body, Controller, Get, Post } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompanyResponseDto } from './dto/company-response.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  findMyCompanies(@CurrentUser() user: JwtPayload): Promise<CompanyResponseDto[]> {
    return this.companiesService.findByUser(user.sub);
  }

  @Post()
  create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateCompanyDto,
  ): Promise<CompanyResponseDto> {
    return this.companiesService.create(user.sub, dto);
  }
}
