import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@ApiTags('subjects')
@Controller('/subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une matière' })
  @ApiOkResponse({ description: 'Matière créée avec succès' })
  create(@Body() dto: CreateSubjectDto) {
    return this.subjectService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les matières' })
  @ApiOkResponse({ description: 'Matières récupérées avec succès' })
  findAll() {
    return this.subjectService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une matière par id' })
  @ApiOkResponse({ description: 'Matière récupérée avec succès' })
  @ApiNotFoundResponse({ description: 'Matière introuvable' })
  findOne(@Param('id') id: string) {
    return this.subjectService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une matière' })
  @ApiOkResponse({ description: 'Matière mise à jour avec succès' })
  @ApiNotFoundResponse({ description: 'Matière introuvable' })
  update(@Param('id') id: string, @Body() dto: UpdateSubjectDto) {
    return this.subjectService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une matière' })
  @ApiOkResponse({ description: 'Matière supprimée avec succès' })
  @ApiNotFoundResponse({ description: 'Matière introuvable' })
  remove(@Param('id') id: string) {
    return this.subjectService.remove(id);
  }
}
