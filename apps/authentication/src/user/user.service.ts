import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { NotFoundException } from '@nestjs/common';



@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService
  ) { }

  // Creates a new user with hashed password
  async create(createUserDto: CreateUserDto): Promise<any> {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    const user = await createdUser.save();
    const token = this.generateToken(user);
    return {
      message: "User created successfully",
      access_token: token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      }
    };
  }


  // Authenticates a user 
  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return this.generateToken(user);
  }

  // Retrieves all users from the database

  async findAll(): Promise<User[]> {
    return this.userModel.find().select("-password").exec();
  }

  // Delete user from the database
  async deleteUser(id: string): Promise<any> {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return {
      message: "User deleted successfully",
      user,
    };
  }

  // Generates a JWT token for a user
  private generateToken(user: User) {
    const payload = { email: user.email, sub: user._id };
    const secret = "secret";
    return {
      access_token: this.jwtService.sign(payload, { secret, expiresIn: "1h" }),
    };
  }

}
