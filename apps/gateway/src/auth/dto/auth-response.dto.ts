import { ApiProperty } from "@nestjs/swagger";

export class TokenResponseDto {
  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    description: "JWT access token",
  })
  access_token: string;
}

export class UserResponseDto {
  @ApiProperty({
    example: "507f1f77bcf86cd799439011",
    description: "The user ID",
  })
  _id: string;

  @ApiProperty({
    example: "John Doe",
    description: "The name of the user",
  })
  name: string;

  @ApiProperty({
    example: "john@example.com",
    description: "The email of the user",
  })
  email: string;
}
