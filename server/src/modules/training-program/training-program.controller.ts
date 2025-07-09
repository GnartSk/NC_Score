import { Controller, Post, UploadedFile, UseInterceptors, Body, Get, Param, Put, Delete, UseGuards, ForbiddenException, ExecutionContext, CanActivate, Injectable } from '@nestjs/common';
import { TrainingProgramService } from './training-program.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadTrainingProgramDto } from './dto/upload-training-program.dto';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '@/auth/passport/jwt-auth.guard';

// Guard kiểm tra quyền ADMIN
@Injectable()
class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (request.user?.role !== 'ADMIN') {
      throw new ForbiddenException('Only ADMIN can access this resource');
    }
    return true;
  }
}

@Controller('training-program')
@UseGuards(JwtAuthGuard)
export class TrainingProgramController {
  constructor(private readonly trainingProgramService: TrainingProgramService) {}

  // Thêm các route ở đây

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTrainingProgram(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    return this.trainingProgramService.uploadTrainingProgram(file, body);
  }

  @Get()
  async getAllTrainingPrograms() {
    return this.trainingProgramService.getAllTrainingPrograms();
  }

  @Get(':major/:course')
  async getTrainingProgramByMajorAndCourse(
    @Param('major') major: string,
    @Param('course') course: string,
  ) {
    return this.trainingProgramService.getTrainingProgramByMajorAndCourse(major, course);
  }

  @Put(':id')
  async updateTrainingProgram(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.trainingProgramService.updateTrainingProgram(id, body);
  }

  @Delete(':id')
  async deleteTrainingProgram(@Param('id') id: string) {
    return this.trainingProgramService.deleteTrainingProgram(id);
  }
} 