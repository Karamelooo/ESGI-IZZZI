import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserPublic } from './dto/user-public.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async findAll(
    @Query('withDeleted') withDeleted?: string,
  ): Promise<UserPublic[]> {
    return this.userService.findAll(withDeleted === 'true');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one user by id' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('withDeleted') withDeleted?: string,
  ): Promise<UserPublic | null> {
    return this.userService.findOne(id, withDeleted === 'true');
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new user' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() createUserDto: CreateUserDto): Promise<UserPublic> {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update user by id' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserPublic> {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/update-password')
  @ApiOperation({ summary: 'Change user password' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserPublic> {
    return this.userService.updatePassword(id, updatePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/remove')
  @ApiOperation({ summary: 'Soft delete user' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<UserPublic> {
    return this.userService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore soft deleted user' })
  async restore(@Param('id', ParseIntPipe) id: number): Promise<UserPublic> {
    return this.userService.restore(id);
  }
}
