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
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(AccessTokenGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('user:read')
  async findAll(
    @CurrentUser() user: any,
    @Query('withDeleted') withDeleted?: string,
  ): Promise<UserPublic[]> {
    return this.userService.findAll(user.institutionId, withDeleted === 'true');
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getMe(@CurrentUser() user: any): Promise<UserPublic | null> {
    return this.userService.findOneById(
      Number(user.userId),
      Number(user.institutionId),
      false,
    );
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateMe(
    @CurrentUser() user: any,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserPublic> {
    return this.userService.update(
      Number(user.userId),
      Number(user.institutionId),
      updateUserDto,
    );
  }

  @Patch('me/update-password')
  @ApiOperation({ summary: 'Update current user password' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateMyPassword(
    @CurrentUser() user: any,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserPublic> {
    return this.userService.updatePassword(
      Number(user.userId),
      Number(user.institutionId),
      updatePasswordDto,
    );
  }

  @Patch('me/remove')
  @ApiOperation({ summary: 'Soft delete current user account' })
  async removeMe(@CurrentUser() user: any): Promise<UserPublic> {
    return this.userService.remove(
      Number(user.userId),
      Number(user.institutionId),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one user by id' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('user:read')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Query('withDeleted') withDeleted?: string,
  ): Promise<UserPublic | null> {
    return this.userService.findOneById(
      id,
      user.institutionId,
      withDeleted === 'true',
    );
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new user' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseGuards(PermissionsGuard)
  @RequirePermissions('user:create')
  async create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() user: any,
  ): Promise<UserPublic> {
    return this.userService.create(user.institutionId, createUserDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by id' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseGuards(PermissionsGuard)
  @RequirePermissions('user:update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserPublic> {
    return this.userService.update(id, user.institutionId, updateUserDto);
  }

  @Patch(':id/update-password')
  @ApiOperation({ summary: 'Change user password' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseGuards(PermissionsGuard)
  @RequirePermissions('user:update')
  async updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserPublic> {
    return this.userService.updatePassword(
      id,
      user.institutionId,
      updatePasswordDto,
    );
  }

  @Patch(':id/remove')
  @ApiOperation({ summary: 'Soft delete user' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('user:delete')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ): Promise<UserPublic> {
    return this.userService.remove(id, user.institutionId);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore soft deleted user' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('user:delete')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ): Promise<UserPublic> {
    return this.userService.restore(id, user.institutionId);
  }
}
