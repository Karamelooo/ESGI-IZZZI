import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('invitations')
@Controller('invitations')
export class InvitationController {
    constructor(private readonly invitationService: InvitationService) { }

    @Post()
    @UseGuards(AccessTokenGuard, PermissionsGuard)
    @ApiOperation({ summary: 'Create invitation' })
    
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async create(
        @CurrentUser() user: any,
        @Body() createInvitationDto: CreateInvitationDto,
    ) {
        return this.invitationService.create(user.institutionId, createInvitationDto);
    }

    @Get()
    @UseGuards(AccessTokenGuard, PermissionsGuard)
    @ApiOperation({ summary: 'List invitations' })
    
    async findAll(@CurrentUser() user: any) {
        return this.invitationService.findAll(user.institutionId);
    }

    @Get('token/:token')
    @Public()
    @ApiOperation({ summary: 'Get invitation by token' })
    async getByToken(@Param('token') token: string) {
        return this.invitationService.findOneByToken(token);
    }

    @Post('token/:token/accept')
    @Public()
    @ApiOperation({ summary: 'Accept invitation' })
    async acceptInvitation(
        @Param('token') token: string,
        @Body() body: any 
    ) {
        
        
        
        
        

        
        
        return this.invitationService.accept(token, body);
    }
}
