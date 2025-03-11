import { SchemaFactory } from "@nestjs/mongoose";

export class PdfReader {}
export const PdfReaderSchema = SchemaFactory.createForClass(PdfReader);
