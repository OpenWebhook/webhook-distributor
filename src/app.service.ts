import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('bah si');
    return 'Hello World!';
  }
}
