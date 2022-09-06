import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}
  async distributeWebhook(target: string, payload: any): Promise<string> {
    this.httpService.post(target, payload);

    try {
      const response = await firstValueFrom(
        this.httpService.post(target, payload),
      );
      console.log(response.data);
    } catch (error) {
      console.log('oups');
    }
    return 'Hello World!';
  }
}
