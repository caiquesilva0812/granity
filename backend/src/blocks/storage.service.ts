import { Injectable } from '@nestjs/common';
import { extname, join } from 'path';
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
import { randomUUID } from 'crypto';

/**
 * Abstração de armazenamento de arquivos.
 * Dev:  salva em disco local em /uploads.
 * Prod: trocar por implementação R2/S3 sem alterar os controllers.
 */
@Injectable()
export class StorageService {
  private readonly uploadsDir = join(process.cwd(), 'uploads');

  constructor() {
    if (!existsSync(this.uploadsDir)) {
      mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  save(file: Express.Multer.File, companyId: string, blockCode: string): string {
    const dir = join(this.uploadsDir, companyId, blockCode);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const filename = `${randomUUID()}${extname(file.originalname)}`;
    writeFileSync(join(dir, filename), file.buffer);
    return `/uploads/${companyId}/${blockCode}/${filename}`;
  }

  delete(url: string): void {
    const relativePath = url.replace('/uploads/', '');
    const filepath     = join(this.uploadsDir, relativePath);
    if (existsSync(filepath)) unlinkSync(filepath);
  }
}
