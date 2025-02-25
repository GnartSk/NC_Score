import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmpty, IsNotEmpty } from 'class-validator';

@Schema({ timestamps: true })
export class User {
  @Prop()
  gmail: string;

  @Prop()
  username: string;

  @Prop()
  fullName: string;

  @Prop()
  password: string;

  @Prop()
  avatar: string;

  @Prop({ default: 'USER' })
  role: string;

  @Prop()
  codeId: string; //Validation code send via email

  @Prop()
  codeExpired: string;

  @Prop()
  birth: string;

  @Prop()
  gender: string;

  @Prop()
  studentId: number;

  @Prop({ default: false })
  isActive: boolean;

  @Prop()
  idAcademicYear: number;
}
export const UserSchema = SchemaFactory.createForClass(User);
