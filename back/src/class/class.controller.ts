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
import { ClassService } from './class.service';
import { SubjectService } from '../subject/subject.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class, Subject } from '@prisma/client';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('classes')
@Controller('classes')
@UseGuards(AccessTokenGuard, PermissionsGuard)
export class ClassController {
  constructor(
    private readonly classService: ClassService,
    private readonly subjectService: SubjectService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all classes' })
  @RequirePermissions('classes:read')
  async findAll(
    @CurrentUser() user: any,
    @Query('withDeleted') withDeleted?: string,
  ): Promise<Class[]> {
    return this.classService.findAll(
      user.institutionId,
      withDeleted === 'true',
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a class by id' })
  @RequirePermissions('classes:read')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Query('withDeleted') withDeleted?: string,
  ): Promise<Class | null> {
    return this.classService.findOne(
      id,
      user.institutionId,
      withDeleted === 'true',
    );
  }

  @Get(':id/subjects')
  @ApiOperation({ summary: 'Get all subjects by class id' })
  @RequirePermissions('classes:read')
  async findAllSubjectsByClassId(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Query('withDeleted') withDeleted?: string,
  ): Promise<Subject[]> {
    return this.subjectService.findAllByClassId(
      id,
      user.institutionId,
      withDeleted === 'true',
    );
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new class' })
  @RequirePermissions('classes:create')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(
    @Body() createClassDto: CreateClassDto,
    @CurrentUser() user: any,
  ): Promise<Class> {
    return this.classService.create(user.institutionId, createClassDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update class by id' })
  @RequirePermissions('classes:update')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Body() updateClassDto: UpdateClassDto,
  ): Promise<Class> {
    return this.classService.update(id, user.institutionId, updateClassDto);
  }

  @Patch(':id/remove')
  @ApiOperation({ summary: 'Soft delete class' })
  @RequirePermissions('classes:delete')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ): Promise<{ success: boolean }> {
    await this.classService.remove(id, user.institutionId);
    return { success: true };
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore soft deleted class' })
  @RequirePermissions('classes:delete')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ): Promise<Class> {
    return this.classService.restore(id, user.institutionId);
  }
}
