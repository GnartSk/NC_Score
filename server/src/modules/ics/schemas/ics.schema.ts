import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class IcsEvent extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  start: Date;

  @Prop({ required: true })
  end: Date;

  @Prop({ type: String, required: true })
  idStudent: string;

  @Prop({ unique: true })
  uid: string;

  @Prop()
  classCode: string;

  @Prop({ required: true })
  subjectName: string;

  @Prop({ required: true })
  location: string;

  @Prop()
  room: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const IcsEventSchema = SchemaFactory.createForClass(IcsEvent);
