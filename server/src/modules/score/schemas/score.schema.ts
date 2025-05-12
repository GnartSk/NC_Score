import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Score {
  @Prop({
    type: Number,
    set: (value: number) => Math.round(value * 10) / 10, // Làm tròn đến số thập phân thứ nhất
  })
  QT: number;

  @Prop({
    type: Number,
    set: (value: number) => Math.round(value * 10) / 10,
  })
  TH: number;

  @Prop({
    type: Number,
    set: (value: number) => Math.round(value * 10) / 10,
  })
  GK: number;

  @Prop({
    type: Number,
    set: (value: number) => Math.round(value * 10) / 10,
  })
  CK: number;

  @Prop({
    type: Number,
    set: (value: number) => Math.round(value * 100) / 100,
  })
  TK: number;

  @Prop({ type: String, required: true })
  status: string; //"ONSTUDY", "NOTSTUDY", "FINISH"

  @Prop()
  type: string; //"Học lại", "Miễn", "Học phần chính"

  @Prop({ type: String, required: true })
  idStudent: string;

  @Prop({ type: String, required: true })
  subjectCode: string;

  @Prop ()
  semester: string;
}
export const ScoreSchema = SchemaFactory.createForClass(Score);
