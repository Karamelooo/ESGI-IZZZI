import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('forms')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get(':id/statistics')
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @RequirePermissions('response:read')
  getFormStatistics(@Param('id') id: string) {
    return this.statisticsService.getFormStatistics(+id);
  }
}
