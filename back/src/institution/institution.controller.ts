import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InstitutionService } from './institution.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { Institution } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('institutions')
@Controller('institutions')
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  @Get()
  @ApiOperation({ summary: 'Get all institutions' })
  @ApiResponse({ status: 200, description: 'List of institutions' })
  async findAll(): Promise<Institution[]> {
    return this.institutionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an institution by id' })
  @ApiResponse({ status: 200, description: 'Institution found' })
  @ApiResponse({ status: 404, description: 'Institution not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Institution> {
    const institution = await this.institutionService.findOne(id);
    if (!institution) throw new NotFoundException('Institution not found');
    return institution;
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new institution' })
  @ApiResponse({ status: 201, description: 'Institution created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(
    @Body() createInstitutionDto: CreateInstitutionDto,
  ): Promise<Institution> {
    return this.institutionService.create(createInstitutionDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update institution by id' })
  @ApiResponse({ status: 200, description: 'Institution updated' })
  @ApiResponse({ status: 404, description: 'Institution not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInstitutionDto: UpdateInstitutionDto,
  ): Promise<Institution> {
    return this.institutionService.update(id, updateInstitutionDto);
  }

  @Patch(':id/remove')
  @ApiOperation({ summary: 'Soft delete institution' })
  @ApiResponse({ status: 200, description: 'Institution soft deleted' })
  @ApiResponse({ status: 404, description: 'Institution not found' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean }> {
    await this.institutionService.remove(id);
    return { success: true };
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore soft deleted institution' })
  @ApiResponse({ status: 200, description: 'Institution restored' })
  @ApiResponse({ status: 404, description: 'Institution not found' })
  async restore(@Param('id', ParseIntPipe) id: number): Promise<Institution> {
    return this.institutionService.restore(id);
  }
}
