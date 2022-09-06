import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AppController } from './app.controller';
import { WebhookSagas } from './app.saga';
import { AppService } from './app.service';
import { DistributeWebhookHandler } from './distribute-webhook.handler';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [CqrsModule, HttpModule],
  controllers: [AppController],
  providers: [AppService, DistributeWebhookHandler, WebhookSagas],
})
export class AppModule {}
