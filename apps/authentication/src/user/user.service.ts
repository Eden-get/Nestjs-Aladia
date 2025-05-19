import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcrypt";
import { NotFoundException } from '@nestjs/common';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) { }

  /**
   * Creates a new user with hashed password
   * @param createUserDto - User creation data
   * @returns Promise containing the created user
   */
  async create(createUserDto: CreateUserDto): Promise<any> {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    const user = await createdUser.save();
    return {
      message: "User created successfully",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      }
    };
  }

  /**
   * Authenticates a user 
   * @param loginDto - Login credentials
   * @returns Promise containing JWT token
   * @throws UnauthorizedException if credentials are invalid
   */
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
    return {
      message: "Login successfully",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      }
    };
  }

  /**
   * Retrieves all users from the database
   * @returns Promise containing array of users (excluding passwords)
   */
  async findAll(): Promise<User[]> {
    return this.userModel.find().select("-password").exec();
  }

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

}
