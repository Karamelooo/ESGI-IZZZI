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
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';
import { FormTemplateService } from './form-template.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('form-templates')
@UseGuards(AccessTokenGuard, PermissionsGuard)
export class FormTemplateController {
  constructor(private readonly formTemplateService: FormTemplateService) {}

  @Post()
  @RequirePermissions('form:create')
  create(@Body() createFormTemplateDto: CreateFormTemplateDto) {
    return this.formTemplateService.create(createFormTemplateDto);
  }

  @Get()
  @RequirePermissions('form:read')
  findAll() {
    return this.formTemplateService.findAll();
  }

  @Get(':id')
  @RequirePermissions('form:read')
  findOne(@Param('id') id: string) {
    return this.formTemplateService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions('form:update')
  update(
    @Param('id') id: string,
    @Body() updateFormTemplateDto: UpdateFormTemplateDto,
  ) {
    return this.formTemplateService.update(+id, updateFormTemplateDto);
  }

  @Delete(':id')
  @RequirePermissions('form:delete')
  remove(@Param('id') id: string) {
    return this.formTemplateService.remove(+id);
  }
}
