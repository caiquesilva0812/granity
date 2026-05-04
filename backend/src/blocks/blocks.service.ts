import { Injectable, NotFoundException } from '@nestjs/common';
import { PhotoAngle } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from './storage.service';
import { BlockResponseDto } from './dto/block-response.dto';
import { CreateBlockDto } from './dto/create-block.dto';

const INCLUDE = {
  materialType:      true,
  classification:    true,
  photos:            true,
  observationPhotos: true,
} as const;

@Injectable()
export class BlocksService {
  constructor(
    private readonly prisma:   PrismaService,
    private readonly storage:  StorageService,
  ) {}

  async findAll(companyId: string): Promise<BlockResponseDto[]> {
    const blocks = await this.prisma.block.findMany({
      where:   { companyId },
      include: INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
    return blocks.map((b) => new BlockResponseDto(b));
  }

  async create(companyId: string, dto: CreateBlockDto): Promise<BlockResponseDto> {
    const code = await this.generateCode(companyId);
    const cNet = dto.cNet ?? Number((dto.c - 0.10).toFixed(2));
    const lNet = dto.lNet ?? Number((dto.l - 0.10).toFixed(2));
    const aNet = dto.aNet ?? Number((dto.a - 0.05).toFixed(2));

    const block = await this.prisma.block.create({
      data: {
        companyId,
        code,
        c: dto.c, l: dto.l, a: dto.a,
        cNet, lNet, aNet,
        materialTypeId:           dto.materialTypeId,
        materialClassificationId: dto.materialClassificationId,
        extractionFront:          dto.extractionFront,
        extractedAt:              dto.extractedAt ? new Date(dto.extractedAt) : null,
        notes:                    dto.notes,
      },
      include: INCLUDE,
    });
    return new BlockResponseDto(block);
  }

  async saveAnglePhoto(
    companyId: string,
    blockId:   string,
    angle:     PhotoAngle,
    file:      Express.Multer.File,
  ): Promise<BlockResponseDto> {
    await this.findOrThrow(companyId, blockId);

    const url = this.storage.save(file);

    await this.prisma.blockPhoto.upsert({
      where:  { blockId_angle: { blockId, angle } },
      update: { url },
      create: { blockId, angle, url },
    });

    return this.reload(blockId);
  }

  async saveObservationPhoto(
    companyId: string,
    blockId:   string,
    file:      Express.Multer.File,
    caption?:  string,
  ): Promise<BlockResponseDto> {
    await this.findOrThrow(companyId, blockId);

    const url = this.storage.save(file);

    await this.prisma.blockObservationPhoto.create({
      data: { blockId, url, caption },
    });

    return this.reload(blockId);
  }

  async deleteObservationPhoto(
    companyId: string,
    blockId:   string,
    photoId:   string,
  ): Promise<void> {
    await this.findOrThrow(companyId, blockId);

    const photo = await this.prisma.blockObservationPhoto.findFirst({
      where: { id: photoId, blockId },
    });
    if (!photo) throw new NotFoundException('Foto não encontrada.');

    this.storage.delete(photo.url);
    await this.prisma.blockObservationPhoto.delete({ where: { id: photoId } });
  }

  private async findOrThrow(companyId: string, blockId: string) {
    const block = await this.prisma.block.findFirst({ where: { id: blockId, companyId } });
    if (!block) throw new NotFoundException('Bloco não encontrado.');
    return block;
  }

  private async reload(blockId: string): Promise<BlockResponseDto> {
    const block = await this.prisma.block.findUniqueOrThrow({
      where:   { id: blockId },
      include: INCLUDE,
    });
    return new BlockResponseDto(block);
  }

  private async generateCode(companyId: string): Promise<string> {
    const last = await this.prisma.block.findFirst({
      where:   { companyId },
      orderBy: { createdAt: 'desc' },
      select:  { code: true },
    });
    const lastNum = last ? parseInt(last.code.split('-')[1] ?? '0', 10) : 0;
    return `BLK-${String(lastNum + 1).padStart(4, '0')}`;
  }
}
