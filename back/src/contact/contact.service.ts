import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly mailService: MailService) {}

  async handleContactRequest(createContactDto: CreateContactDto) {
    await this.mailService.sendContactRequestEmail(createContactDto);
    return { success: true, message: 'Contact request sent successfully' };
  }
}
