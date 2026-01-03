import { Module } from '@nestjs/common';
import { FormTemplateController } from './form-template.controller';
import { FormTemplateService } from './form-template.service';

@Module({
  controllers: [FormTemplateController],
  providers: [FormTemplateService],
})
export class FormTemplateModule {}
