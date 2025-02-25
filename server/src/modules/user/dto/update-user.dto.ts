import { Prop } from '@nestjs/mongoose';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
	@IsMongoId({ message: 'Invalid _id' })
	@IsNotEmpty({ message: '_id cannot be blank' })
	_id: string;

	@IsOptional()
	username: string;

	@IsOptional()
	fullName: string;

	@IsOptional()
	avatar: string;

	@IsOptional()
	birth: string;

	@IsOptional()
	gender: string;
}
