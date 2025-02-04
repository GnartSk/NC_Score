import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3004;

  if (port === undefined) {
    throw new Error('PORT configuration is not set');
  }

  await app.listen(port);
}
bootstrap();
