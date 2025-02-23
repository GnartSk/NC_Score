import { IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty({ message: 'gmail cannot be blank' })
  gmail: string;

  @IsNotEmpty({message: "password cannot be blank"})
  password: string;
}
