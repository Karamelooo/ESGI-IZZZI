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
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from '@prisma/client';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('subjects')
@Controller('subjects')
@UseGuards(AccessTokenGuard, PermissionsGuard)
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Get()
  @ApiOperation({ summary: 'Get all subjects' })
  @RequirePermissions('subject:read')
  async findAll(
    @CurrentUser() user: any,
    @Query('withDeleted') withDeleted?: string,
  ): Promise<Subject[]> {
    return this.subjectService.findAll(
      user.institutionId,
      withDeleted === 'true',
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a subject by id' })
  @RequirePermissions('subject:read')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Query('withDeleted') withDeleted?: string,
  ): Promise<Subject | null> {
    return this.subjectService.findOne(
      id,
      user.institutionId,
      withDeleted === 'true',
    );
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new subject' })
  @RequirePermissions('subject:create')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(
    @Body() createSubjectDto: CreateSubjectDto,
    @CurrentUser() user: any,
  ): Promise<Subject> {
    return this.subjectService.create(user.institutionId, createSubjectDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update subject by id' })
  @RequirePermissions('subject:update')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    return this.subjectService.update(id, user.institutionId, updateSubjectDto);
  }

  @Patch(':id/remove')
  @ApiOperation({ summary: 'Soft delete subject' })
  @RequirePermissions('subject:delete')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ): Promise<{ success: boolean }> {
    await this.subjectService.remove(id, user.institutionId);
    return { success: true };
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore soft deleted subject' })
  @RequirePermissions('subject:delete')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ): Promise<Subject> {
    return this.subjectService.restore(id, user.institutionId);
  }
}
