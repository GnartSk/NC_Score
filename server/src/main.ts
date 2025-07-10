import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './Interceptor/response.interceptor';
import { useContainer } from 'class-validator';
import { getFrontendUri } from './helpers/util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ResponseInterceptor()); // 💡 Áp dụng interceptor toàn bộ app
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  
  app.setGlobalPrefix('api', { exclude: [''] });

  // Bật CORS
  const allowedOrigins = [
    getFrontendUri(),
    'https://nc-score-project.vercel.app',
    'https://nc-score-project.vercel.app/',
    'http://localhost:3000',
    'http://localhost:3001'
  ].filter(Boolean); // Loại bỏ các giá trị undefined/null

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  if (port === undefined) {
    throw new Error('PORT configuration is not set');
  }

  await app.listen(port);
}
bootstrap();
