import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty({ message: 'gmail is required' })
	gmail: string;

	@IsNotEmpty({ message: 'username is required' })
	username: string;

	@IsNotEmpty({ message: 'fullName is required' })
	fullName: string;

	@IsNotEmpty({ message: 'password is required' })
	password: string;

	@IsNotEmpty({ message: 'studentId is required' })
	studentId: string;

	@IsNotEmpty({ message: 'idAcademicYear is required' })
	idAcademicYear: string;

	@Prop()
	avatar: string;

	@Prop()
	birth: string;

	@Prop()
	gender: string;
}
