import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Saas API')
    .setDescription('The SaaS Enterprise Backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log('\n' + '='.repeat(40));
  console.log('🚀 ENTERPRISE SAAS BACKEND IS LIVE');
  console.log(`📡 API URL: http://localhost:${port}`);
  console.log(`📚 SWAGGER: http://localhost:${port}/docs`);
  console.log(`💻 FRONTEND: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log('='.repeat(40) + '\n');
}
bootstrap();
