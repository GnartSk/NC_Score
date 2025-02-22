import { Prop } from '@nestjs/mongoose';
import { IsEmpty, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({message: "gmail is required"})
  gmail: string;

  @IsNotEmpty({message: "username is required"})
  username: string;

  @IsNotEmpty({message: "fullName is required"})
  fullName: string;

  @IsNotEmpty({message: "password is required"})
  password: string;

  @Prop()
  avatar: string;

  @Prop()
  birth: string;

  @Prop()
  gender: string;
}
