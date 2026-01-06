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
import { InstitutionService } from './institution.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { Institution } from '@prisma/client';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('institutions')
@Controller('institutions')
@UseGuards(AccessTokenGuard, PermissionsGuard)
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  @Get()
  @ApiOperation({ summary: 'Get all institutions' })
  @RequirePermissions('institution:read')
  async findAll(
    @Query('withDeleted') withDeleted?: string,
  ): Promise<Institution[]> {
    return this.institutionService.findAll(withDeleted === 'true');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an institution by id' })
  @RequirePermissions('institution:read')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('withDeleted') withDeleted?: string,
  ): Promise<Institution | null> {
    return this.institutionService.findOne(id, withDeleted === 'true');
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new institution' })
  @RequirePermissions('institution:create')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(
    @Body() createInstitutionDto: CreateInstitutionDto,
  ): Promise<Institution> {
    return this.institutionService.create(createInstitutionDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update institution by id' })
  @RequirePermissions('institution:update')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInstitutionDto: UpdateInstitutionDto,
  ): Promise<Institution> {
    return this.institutionService.update(id, updateInstitutionDto);
  }

  @Patch(':id/remove')
  @ApiOperation({ summary: 'Soft delete institution' })
  @RequirePermissions('institution:delete')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean }> {
    await this.institutionService.remove(id);
    return { success: true };
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore soft deleted institution' })
  @RequirePermissions('institution:delete')
  async restore(@Param('id', ParseIntPipe) id: number): Promise<Institution> {
    return this.institutionService.restore(id);
  }
}
