import { Module } from '@nestjs/common';
import { BlocksController } from './blocks.controller';
import { BlocksService } from './blocks.service';
import { StorageService } from './storage.service';

@Module({
  controllers: [BlocksController],
  providers:   [BlocksService, StorageService],
})
export class BlocksModule {}
