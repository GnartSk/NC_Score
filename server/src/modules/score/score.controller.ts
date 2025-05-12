import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query, ValidationPipe, UsePipes } from '@nestjs/common';
import { ScoreService } from './score.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { PaginationDto } from '../user/dto/pagination.dto';
import { StudentGradesDTO } from './dto/all-score-body.dto';

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

  // @Get('users')
  // findAllScoreOfUsers(@Query() paginationDto: PaginationDto) {
  //   return this.scoreService.findAllScoreOfUsers(paginationDto);
  // }

  @Get('profile')
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

  //Hàm chưa xài được
  @Post('allScore')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  uploadAllScore(@Request() req, @Body(new ValidationPipe({ transform: true })) body: StudentGradesDTO) {
    console.log(body);
    return this.scoreService.uploadAllScore();
  }
}
