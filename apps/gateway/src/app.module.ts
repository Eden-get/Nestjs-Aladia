
import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import authConfig from "@auth-config";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [authConfig],
      isGlobal: true,
    }),
    AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
