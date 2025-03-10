import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query } from '@nestjs/common';
import { ScoreService } from './score.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { PaginationDto } from '../user/dto/pagination.dto';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Post()
  create(@Body() createScoreDto: CreateScoreDto, @Request() req) {
    return this.scoreService.create(createScoreDto, req.user._id);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.scoreService.findAll(paginationDto);
  }

  @Get()
  findAllOfUser(@Request() req) {
    return this.scoreService.findAllOfUser(req.user._id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scoreService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') _id: string, @Body() updateScoreDto: UpdateScoreDto) {
    return this.scoreService.update(_id, updateScoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scoreService.remove(id);
  }
}
