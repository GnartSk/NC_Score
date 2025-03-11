import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch()
  @UseInterceptors(FileInterceptor('avatar'))
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto, @UploadedFile() file: Express.Multer.File) {
    let imageUrl: string | null = null;
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      imageUrl = uploadResult.secure_url; // Lấy link ảnh sau khi upload thành công
    }

    if (imageUrl) {
      updateUserDto.avatar = imageUrl;
    }

    return this.userService.update(req.user._id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
