import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Subject {
  @Prop()
  group: string;

  @Prop()
  subjectCode: string;

  @Prop()
  subjectName: string;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);

@Schema({ timestamps: true })
export class TrainingProgram extends Document {
  @Prop()
  major: string;

  @Prop()
  majorCode: string;

  @Prop()
  course: string;

  @Prop([SubjectSchema])
  subjects: Subject[];
}

export const TrainingProgramSchema = SchemaFactory.createForClass(TrainingProgram); 