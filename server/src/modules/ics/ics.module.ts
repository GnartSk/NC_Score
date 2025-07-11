import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IcsController } from './ics.controller';
import { IcsService } from './ics.service';
import { IcsEvent, IcsEventSchema } from './schemas/ics.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: IcsEvent.name, schema: IcsEventSchema }]),
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.join(process.cwd(), 'uploads', 'ics');
          
          // Đảm bảo thư mục tồn tại
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
      // Này là quan trọng: lưu cả buffer vào bộ nhớ
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      preservePath: true,
    }),
  ],
  controllers: [IcsController],
  providers: [IcsService],
  exports: [IcsService],
})
export class IcsModule {}
