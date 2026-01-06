import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateResponseDto } from './dto/create-response.dto';
import { ResponseService } from './response.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('responses')
@UseGuards(AccessTokenGuard, PermissionsGuard)
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Post()
  @RequirePermissions('response:create')
  create(@Body() createResponseDto: CreateResponseDto) {
    return this.responseService.create(createResponseDto);
  }

  @Get()
  @RequirePermissions('response:read')
  findAll() {
    return this.responseService.findAll();
  }

  @Get(':id')
  @RequirePermissions('response:read')
  findOne(@Param('id') id: string) {
    return this.responseService.findOne(+id);
  }
}
