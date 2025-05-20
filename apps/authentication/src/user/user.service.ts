import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from '../../../../common/dto/create-user.dto';
import { LoginDto } from '../../../../common/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { NotFoundException } from '@nestjs/common';
import authConfig from '@auth-config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
  ) { }

  // Creates a new user with hashed password
  async create(createUserDto: CreateUserDto): Promise<any> {
    try {
      // Hash the password before saving
      const hashedPassword = await hash(createUserDto.password, 10);
      const createdUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      const user = await createdUser.save();
      const token = this.generateToken(user);
      return {
        message: 'User created successfully',
        access_token: token,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new UnauthorizedException('Could not create user');
    }
  }

  // Authenticates a user
  async login(loginDto: LoginDto): Promise<any> {
    try {
      const user = await this.userModel
        .findOne({ email: loginDto.email })
        .exec();

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordValid = await compare(loginDto.password, user.password);
      console.log(isPasswordValid);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      return this.generateToken(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Login error:', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }

  // Retrieves all users from the database

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  // Delete user from the database
  async deleteUser(id: string): Promise<any> {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'User deleted successfully',
      user,
    };
  }

  // Generates a JWT token for a user
  private generateToken(user: User) {
    try {
      const payload = { email: user.email, sub: user._id };
      console.log(this.authConfiguration);
      return {
        access_token: this.jwtService.sign(payload, {
          secret: this.authConfiguration.secret,
          expiresIn: this.authConfiguration.expiresIn || '1h',
        }),
      };
    } catch (error) {
      console.error('Token generation error:', error);
      throw new UnauthorizedException('Could not generate token');
    }
  }
}