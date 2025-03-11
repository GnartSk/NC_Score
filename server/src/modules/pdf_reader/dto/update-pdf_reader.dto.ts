import { PartialType } from '@nestjs/mapped-types';
import { CreatePdfReaderDto } from './create-pdf_reader.dto';

export class UpdatePdfReaderDto extends PartialType(CreatePdfReaderDto) {}
