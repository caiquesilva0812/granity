import { Module } from '@nestjs/common';
import { MaterialsController } from './materials.controller';
import { MaterialsService } from './materials.service';
import { CompanyAccessGuard } from '../common/guards/company-access.guard';

@Module({
  controllers: [MaterialsController],
  providers:   [MaterialsService, CompanyAccessGuard],
})
export class MaterialsModule {}
