import { IsString } from "class-validator";

export class ChangePasswrodDto {
    @IsString()
    oldPassword: string;

    @IsString()
    newPassword: string;
}