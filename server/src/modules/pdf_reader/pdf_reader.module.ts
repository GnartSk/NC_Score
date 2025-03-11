import { Module } from '@nestjs/common';
import { PdfReaderService } from './pdf_reader.service';
import { PdfReaderController } from './pdf_reader.controller';
import { AuthService } from '@/auth/auth.service';
import { JwtStrategy } from '@/auth/passport/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { PdfReader, PdfReaderSchema } from './schemas/pdf_reader.schema';
import { UserModule } from '../user/user.module';
import { AuthController } from '@/auth/auth.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: PdfReader.name, schema: PdfReaderSchema }]), UserModule],
  controllers: [PdfReaderController, AuthController],
  providers: [PdfReaderService, AuthService, JwtStrategy],
})
export class PdfReaderModule {}
