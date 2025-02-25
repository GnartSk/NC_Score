import { Module } from '@nestjs/common';
import { SubjectRelateService } from './subject_relate.service';
import { SubjectRelateController } from './subject_relate.controller';

@Module({
	controllers: [SubjectRelateController],
	providers: [SubjectRelateService],
})
export class SubjectRelateModule {}
