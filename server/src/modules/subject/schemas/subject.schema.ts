import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({ timestamps: true })
export class Subject {
  @Prop()
  subjectCode: string;

  @Prop()
  subjectName: string;

  @Prop() // tín chỉ
  credit: string;

  @Prop()
  blockOfKnowledge: string;

  @Prop()
  specialized: string;
}
export const SubjectSchema = SchemaFactory.createForClass(Subject);
