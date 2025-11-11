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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('institutions')
@Controller('institutions')
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  @Get()
  @ApiOperation({ summary: 'Get all institutions' })
  async findAll(
    @Query('withDeleted') withDeleted?: string,
  ): Promise<Institution[]> {
    return this.institutionService.findAll(withDeleted === 'true');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an institution by id' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('withDeleted') withDeleted?: string,
  ): Promise<Institution | null> {
    return this.institutionService.findOne(id, withDeleted === 'true');
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new institution' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(
    @Body() createInstitutionDto: CreateInstitutionDto,
  ): Promise<Institution> {
    return this.institutionService.create(createInstitutionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update institution by id' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInstitutionDto: UpdateInstitutionDto,
  ): Promise<Institution> {
    return this.institutionService.update(id, updateInstitutionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/remove')
  @ApiOperation({ summary: 'Soft delete institution' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean }> {
    await this.institutionService.remove(id);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore soft deleted institution' })
  async restore(@Param('id', ParseIntPipe) id: number): Promise<Institution> {
    return this.institutionService.restore(id);
  }
}
