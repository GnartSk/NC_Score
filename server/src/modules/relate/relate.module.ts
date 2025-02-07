import { Module } from '@nestjs/common';
import { RelateService } from './relate.service';
import { RelateController } from './relate.controller';

@Module({
  controllers: [RelateController],
  providers: [RelateService],
})
export class RelateModule {}
