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
import { ClassesService } from './classes.service';
import { CreateClassesDto } from './dto/create-classes.dto';
import { UpdateClassesDto } from './dto/update-classes.dto';

@ApiTags('classes')
@Controller('/classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une classe' })
  @ApiOkResponse({ description: 'Classe créée avec succès' })
  create(@Body() dto: CreateClassesDto) {
    return this.classesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les classes' })
  @ApiOkResponse({ description: 'Classes récupérées avec succès' })
  findAll() {
    return this.classesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une classe par id' })
  @ApiOkResponse({ description: 'Classe récupérée avec succès' })
  @ApiNotFoundResponse({ description: 'Classe introuvable' })
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une classe' })
  @ApiOkResponse({ description: 'Classe mise à jour avec succès' })
  @ApiNotFoundResponse({ description: 'Classe introuvable' })
  update(@Param('id') id: string, @Body() dto: UpdateClassesDto) {
    return this.classesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une classe' })
  @ApiOkResponse({ description: 'Classe supprimée avec succès' })
  @ApiNotFoundResponse({ description: 'Classe introuvable' })
  remove(@Param('id') id: string) {
    return this.classesService.remove(id);
  }
}
