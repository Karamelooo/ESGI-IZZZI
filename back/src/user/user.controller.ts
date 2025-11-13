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
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserPublic } from './dto/user-public.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @Permissions('users:read')
  async findAll(
    @Query('withDeleted') withDeleted?: string,
  ): Promise<UserPublic[]> {
    return this.userService.findAll(withDeleted === 'true');
  }

  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get one user by id' })
  @Permissions('users:read')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('withDeleted') withDeleted?: string,
  ): Promise<UserPublic | null> {
    return this.userService.findOne(id, withDeleted === 'true');
  }

  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new user' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Permissions('users:manage')
  async create(@Body() createUserDto: CreateUserDto): Promise<UserPublic> {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update user by id' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Permissions('users:manage')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserPublic> {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @Patch(':id/update-password')
  @ApiOperation({ summary: 'Change user password' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Permissions('users:manage')
  async updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserPublic> {
    return this.userService.updatePassword(id, updatePasswordDto);
  }

  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @Patch(':id/remove')
  @ApiOperation({ summary: 'Soft delete user' })
  @Permissions('users:manage')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<UserPublic> {
    return this.userService.remove(id);
  }

  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore soft deleted user' })
  @Permissions('users:manage')
  async restore(@Param('id', ParseIntPipe) id: number): Promise<UserPublic> {
    return this.userService.restore(id);
  }
}
