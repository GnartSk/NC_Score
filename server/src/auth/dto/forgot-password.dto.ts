import { IsEmail } from "class-validator";

export class ForgotPasswordDto {
    @IsEmail()
    gmail: string;
}