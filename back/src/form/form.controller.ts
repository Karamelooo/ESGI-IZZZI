import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { FormService } from './form.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('forms')
export class FormController {
  constructor(private readonly formService: FormService) { }

  @Post()
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @RequirePermissions('form:create')
  create(@Body() createFormDto: CreateFormDto) {
    return this.formService.create(createFormDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @RequirePermissions('form:read')
  findAll() {
    return this.formService.findAll();
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @RequirePermissions('form:read')
  findOne(@Param('id') id: string) {
    return this.formService.findOne(+id);
  }

  @Get('public/:id')
  findPublic(@Param('id') id: string) {
    return this.formService.findPublic(+id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @RequirePermissions('form:update')
  update(@Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
    return this.formService.update(+id, updateFormDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @RequirePermissions('form:delete')
  remove(@Param('id') id: string) {
    return this.formService.remove(+id);
  }

  @Post(':id/remind')
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @RequirePermissions('form:update')
  remind(@Param('id') id: string) {
    return this.formService.remind(+id);
  }
}
