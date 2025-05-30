import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Applies validation globally across all routes.
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle("NestJS Microservices API")
    .setDescription("The NestJS Microservices API documentation")
    .setVersion("1.0")
    .addTag("auth")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // Swagger UI available at http://localhost:3000/api
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}
bootstrap();
