import { IsNotEmpty, IsString, IsOptional, IsDateString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class IcsEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  start: string;

  @IsDateString()
  @IsNotEmpty()
  end: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsNotEmpty()
  subjectName: string;
}

export class IcsFileDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IcsEventDto)
  events: IcsEventDto[];
}
