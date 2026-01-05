import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHomeMessage(): string {
    return 'Welcome to the IZZZI API.';
  }
}
