import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    return {
      name: 'Portfolio API',
      author: 'Muhammad Ihsan Ramadhan',
      status: 'ok',
    };
  }
}
