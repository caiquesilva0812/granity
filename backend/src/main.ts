import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // remove campos não declarados no DTO
      forbidNonWhitelisted: true, // rejeita request com campos extras
      transform: true,            // converte tipos automaticamente
    }),
  );

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
}

bootstrap();
