import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { CreateMaterialTypeDto } from './dto/create-material-type.dto';
import { UpdateMaterialTypeDto } from './dto/update-material-type.dto';
import { CreateClassificationDto } from './dto/create-classification.dto';
import { UpdateClassificationDto } from './dto/update-classification.dto';
import { MaterialTypeResponseDto } from './dto/material-type-response.dto';
import { CompanyAccessGuard } from '../common/guards/company-access.guard';

@UseGuards(CompanyAccessGuard)
@Controller('companies/:companyId/material-types')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  // ── MaterialType ─────────────────────────────────────────────────────────────

  @Get()
  findAll(@Param('companyId') companyId: string): Promise<MaterialTypeResponseDto[]> {
    return this.materialsService.findAll(companyId);
  }

  @Post()
  create(
    @Param('companyId') companyId: string,
    @Body() dto: CreateMaterialTypeDto,
  ): Promise<MaterialTypeResponseDto> {
    return this.materialsService.create(companyId, dto);
  }

  @Patch(':id')
  update(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: UpdateMaterialTypeDto,
  ): Promise<MaterialTypeResponseDto> {
    return this.materialsService.update(companyId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.materialsService.remove(companyId, id);
  }

  // ── MaterialClassification ───────────────────────────────────────────────────

  @Post(':typeId/classifications')
  createClassification(
    @Param('companyId') companyId: string,
    @Param('typeId') typeId: string,
    @Body() dto: CreateClassificationDto,
  ): Promise<MaterialTypeResponseDto> {
    return this.materialsService.createClassification(companyId, typeId, dto);
  }

  @Patch(':typeId/classifications/:id')
  updateClassification(
    @Param('companyId') companyId: string,
    @Param('typeId') typeId: string,
    @Param('id') id: string,
    @Body() dto: UpdateClassificationDto,
  ): Promise<MaterialTypeResponseDto> {
    return this.materialsService.updateClassification(companyId, typeId, id, dto);
  }

  @Delete(':typeId/classifications/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeClassification(
    @Param('companyId') companyId: string,
    @Param('typeId') typeId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.materialsService.removeClassification(companyId, typeId, id);
  }
}
