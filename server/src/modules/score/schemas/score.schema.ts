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

  @Prop()
  status: string; //"ONSTUDY", "NOTSTUDY", "FINISH"

  @Prop()
  idStudentId: string;

  @Prop()
  idSubject: string;
}
export const ScoreSchema = SchemaFactory.createForClass(Score);
