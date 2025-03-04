import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({ timestamps: true })
export class Subject {
  @Prop()
  subjectCode: string;

  @Prop()
  subjectName: string;

  @Prop() // tín chỉ
  credit: number;

  @Prop()
  blockOfKnowledge: string;

  @Prop()
  specialized: string;

  @Prop({ type: [String], default: [] }) // Object chứa nhiều chuỗi
  relatedToIndustry: string[];
}
export const SubjectSchema = SchemaFactory.createForClass(Subject);
