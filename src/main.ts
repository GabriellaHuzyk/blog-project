import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UnauthorizedInterceptor } from './common/filters/http-exception/errors/interceptors/unauthorized.interceptor';
import { NotfoundInterceptor } from './common/filters/http-exception/errors/interceptors/not-found.interceptor';
import { ConflictsInterceptor } from './common/filters/http-exception/errors/interceptors/conflict.interceptor';
import { DatabaseInterceptor } from './common/filters/http-exception/errors/interceptors/database.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Blog')
    .setDescription('The Simple Blog API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  //app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ConflictsInterceptor());
  app.useGlobalInterceptors(new DatabaseInterceptor());
  app.useGlobalInterceptors(new UnauthorizedInterceptor());
  app.useGlobalInterceptors(new NotfoundInterceptor());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
