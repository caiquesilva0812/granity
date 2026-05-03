import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaterialTypeDto } from './dto/create-material-type.dto';
import { UpdateMaterialTypeDto } from './dto/update-material-type.dto';
import { CreateClassificationDto } from './dto/create-classification.dto';
import { UpdateClassificationDto } from './dto/update-classification.dto';
import { MaterialTypeResponseDto } from './dto/material-type-response.dto';

@Injectable()
export class MaterialsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── MaterialType ─────────────────────────────────────────────────────────────

  async findAll(companyId: string): Promise<MaterialTypeResponseDto[]> {
    const types = await this.prisma.materialType.findMany({
      where:   { companyId },
      include: { classifications: { orderBy: { price: 'desc' } } },
      orderBy: { name: 'asc' },
    });

    return types.map((t) => new MaterialTypeResponseDto(t));
  }

  async create(
    companyId: string,
    dto: CreateMaterialTypeDto,
  ): Promise<MaterialTypeResponseDto> {
    const type = await this.prisma.materialType.create({
      data:    { companyId, name: dto.name, description: dto.description },
      include: { classifications: true },
    });

    return new MaterialTypeResponseDto(type);
  }

  async update(
    companyId: string,
    typeId: string,
    dto: UpdateMaterialTypeDto,
  ): Promise<MaterialTypeResponseDto> {
    await this.findTypeOrThrow(companyId, typeId);

    const type = await this.prisma.materialType.update({
      where:   { id: typeId },
      data:    dto,
      include: { classifications: { orderBy: { price: 'desc' } } },
    });

    return new MaterialTypeResponseDto(type);
  }

  async remove(companyId: string, typeId: string): Promise<void> {
    await this.findTypeOrThrow(companyId, typeId);
    await this.prisma.materialType.delete({ where: { id: typeId } });
  }

  // ── MaterialClassification ───────────────────────────────────────────────────

  async createClassification(
    companyId: string,
    typeId: string,
    dto: CreateClassificationDto,
  ): Promise<MaterialTypeResponseDto> {
    await this.findTypeOrThrow(companyId, typeId);

    await this.prisma.materialClassification.create({
      data: { materialTypeId: typeId, name: dto.name, price: dto.price, currency: dto.currency },
    });

    return this.findTypeWithClassifications(companyId, typeId);
  }

  async updateClassification(
    companyId: string,
    typeId: string,
    classificationId: string,
    dto: UpdateClassificationDto,
  ): Promise<MaterialTypeResponseDto> {
    await this.findTypeOrThrow(companyId, typeId);
    await this.findClassificationOrThrow(typeId, classificationId);

    await this.prisma.materialClassification.update({
      where: { id: classificationId },
      data:  dto,
    });

    return this.findTypeWithClassifications(companyId, typeId);
  }

  async removeClassification(
    companyId: string,
    typeId: string,
    classificationId: string,
  ): Promise<void> {
    await this.findTypeOrThrow(companyId, typeId);
    await this.findClassificationOrThrow(typeId, classificationId);
    await this.prisma.materialClassification.delete({ where: { id: classificationId } });
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  private async findTypeOrThrow(companyId: string, typeId: string) {
    const type = await this.prisma.materialType.findFirst({
      where: { id: typeId, companyId },
    });
    if (!type) throw new NotFoundException('Tipo de material não encontrado.');
    return type;
  }

  private async findClassificationOrThrow(typeId: string, classificationId: string) {
    const cls = await this.prisma.materialClassification.findFirst({
      where: { id: classificationId, materialTypeId: typeId },
    });
    if (!cls) throw new NotFoundException('Classificação não encontrada.');
    return cls;
  }

  private async findTypeWithClassifications(companyId: string, typeId: string) {
    const type = await this.prisma.materialType.findFirstOrThrow({
      where:   { id: typeId, companyId },
      include: { classifications: { orderBy: { price: 'desc' } } },
    });
    return new MaterialTypeResponseDto(type);
  }
}
