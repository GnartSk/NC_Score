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

  @Prop() //ADMIN, USER
  role: string;

  @Prop({ type: String, default: null })
  codeId: string | null; //Validation code send via email

  @Prop({ type: Date, default: null })
  codeExpired: Date | null;

  @Prop()
  birth: string;

  @Prop()
  gender: string;

  @Prop()
  studentId: number;

  @Prop({ default: false })
  isActive: boolean;

  @Prop()
  academicYear: number;

  @Prop()
  specialized: string;

  @Prop()
  cumulativeCredit: string;

  @Prop()
  cumulativeScore: string;

  @Prop()
  course: string; // K17, K18, K19

  @Prop()
  major: string; // An toàn thông tin, Mạng máy tính & Truyền thông dữ liệu

  @Prop({ default: 0 })
  earnedCredits: number;
}
export const UserSchema = SchemaFactory.createForClass(User);
