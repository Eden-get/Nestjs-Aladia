import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateUserDto } from "../../../../common/dto/create-user.dto";
import { LoginDto } from "../../../../common/dto/login.dto";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AuthService {
  constructor(
    // Inject the authentication microservice client
    @Inject("AUTH_SERVICE") private readonly authClient: ClientProxy
  ) { }

  // Registers a new user by sending a request to the authentication service
  async register(createUserDto: CreateUserDto) {
    return firstValueFrom(
      this.authClient.send({ cmd: "register" }, createUserDto)
    );
  }

  // Authenticates a user by sending login credentials to the authentication service
  async login(loginDto: LoginDto) {
    return firstValueFrom(this.authClient.send({ cmd: "login" }, loginDto));
  }

  // Retrieves all users from the authentication service
  async getAllUsers() {
    return firstValueFrom(this.authClient.send({ cmd: "get_users" }, {}));
  }

  // Deletes user from the authentication service
  async deleteUser(id: string) {
    return firstValueFrom(this.authClient.send({ cmd: "delete-user" }, id));
  }

}
