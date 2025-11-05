import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({
    summary: "Récuperer les informations de l'utilisateur actuel",
  })
  @ApiOkResponse({
    type: Object,
    description: 'Informations de l’utilisateur actuel récupérées avec succès',
  })
  @ApiNotFoundResponse({
    description: 'Utilisateur non trouvé',
  })
  getCurrentUser() {
    // Placeholder: requires auth context to provide current user
    return this.userService.getCurrentUser();
  }

  @Post()
  @ApiOperation({ summary: 'Créer un utilisateur' })
  @ApiOkResponse({ description: 'Utilisateur créer avec succes' })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "Liste d'utilisateurs" })
  @ApiOkResponse({
    description: 'Liste des utilisateurs récupérée avec succès',
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un utilisateur par ID' })
  @ApiOkResponse({ description: 'Utilisateur récupéré avec succès' })
  @ApiNotFoundResponse({ description: 'Utilisateur non trouvé' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
  @ApiOkResponse({ description: 'Utilisateur mis à jour avec succès' })
  @ApiNotFoundResponse({ description: 'Utilisateur non trouvé' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  @ApiOkResponse({ description: 'Utilisateur supprimé avec succès' })
  @ApiNotFoundResponse({ description: 'Utilisateur non trouvé' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
