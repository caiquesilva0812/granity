import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PhotoAngle } from '@prisma/client';
import { BlocksService } from './blocks.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { BlockResponseDto } from './dto/block-response.dto';
import { CompanyAccessGuard } from '../common/guards/company-access.guard';

const imageUpload = FileInterceptor('file', {
  storage: memoryStorage(),
  limits:  { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Apenas imagens são permitidas.'), false);
    }
    cb(null, true);
  },
});

@UseGuards(CompanyAccessGuard)
@Controller('companies/:companyId/blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Get()
  findAll(@Param('companyId') companyId: string): Promise<BlockResponseDto[]> {
    return this.blocksService.findAll(companyId);
  }

  @Post()
  create(
    @Param('companyId') companyId: string,
    @Body() dto: CreateBlockDto,
  ): Promise<BlockResponseDto> {
    return this.blocksService.create(companyId, dto);
  }

  // ── Fotos por ângulo ────────────────────────────────────────────────────────

  @Post(':blockId/photos')
  @UseInterceptors(imageUpload)
  uploadAnglePhoto(
    @Param('companyId') companyId: string,
    @Param('blockId')   blockId:   string,
    @Query('angle')     angle:     PhotoAngle,
    @UploadedFile()     file:      Express.Multer.File,
  ): Promise<BlockResponseDto> {
    return this.blocksService.saveAnglePhoto(companyId, blockId, angle, file);
  }

  // ── Fotos de observação ─────────────────────────────────────────────────────

  @Post(':blockId/observation-photos')
  @UseInterceptors(imageUpload)
  uploadObservationPhoto(
    @Param('companyId') companyId: string,
    @Param('blockId')   blockId:   string,
    @Query('caption')   caption:   string | undefined,
    @UploadedFile()     file:      Express.Multer.File,
  ): Promise<BlockResponseDto> {
    return this.blocksService.saveObservationPhoto(companyId, blockId, file, caption);
  }

  @Delete(':blockId/observation-photos/:photoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteObservationPhoto(
    @Param('companyId') companyId: string,
    @Param('blockId')   blockId:   string,
    @Param('photoId')   photoId:   string,
  ): Promise<void> {
    return this.blocksService.deleteObservationPhoto(companyId, blockId, photoId);
  }
}
