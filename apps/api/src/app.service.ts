import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Saas Enterprise API is running. Visit /docs for documentation.';
  }
}
