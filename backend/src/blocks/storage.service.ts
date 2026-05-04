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

  save(file: Express.Multer.File): string {
    const filename = `${randomUUID()}${extname(file.originalname)}`;
    writeFileSync(join(this.uploadsDir, filename), file.buffer);
    return `/uploads/${filename}`;
  }

  delete(url: string): void {
    const filename = url.replace('/uploads/', '');
    const filepath  = join(this.uploadsDir, filename);
    if (existsSync(filepath)) unlinkSync(filepath);
  }
}
