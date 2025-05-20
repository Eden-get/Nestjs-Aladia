import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./user/user.module";
import { ConfigModule } from "@nestjs/config";
import authConfig from "@auth-config";

@Module({
    imports: [
        MongooseModule.forRoot("mongodb://localhost:27017/auth-service"),
        UserModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            load: [authConfig],
        }),
    ],
})
export class AppModule { }
