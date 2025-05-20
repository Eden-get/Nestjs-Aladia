import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { UserService } from "./user.service";
import { CreateUserDto } from "../../../../common/dto/create-user.dto";
import { LoginDto } from "../../../../common/dto/login.dto";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @MessagePattern({ cmd: "register" })
  async register(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @MessagePattern({ cmd: "get_users" })
  async getAllUsers() {
    return this.userService.findAll();
  }

  @MessagePattern({ cmd: "login" })
  async login(login: LoginDto) {
    return this.userService.login(login)
  }

  @MessagePattern({ cmd: "delete-user" })
  async deleteUser(id: string) {
    return this.userService.deleteUser(id);
  }
}
