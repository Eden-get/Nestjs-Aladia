/**
 * Main module for the Gateway application.
 * Imports and configures all necessary modules for the gateway service.
 */
import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [AuthModule], // Import AuthModule for handling authentication
  controllers: [],
  providers: [],
})
export class AppModule { }
