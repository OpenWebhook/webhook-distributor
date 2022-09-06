import { Controller, Get } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { WebhookSentEvent } from './webhook-sent.event';

@Controller()
export class AppController {
  constructor(private readonly eventBus: EventBus) {}

  @Get()
  getHello(): string {
    this.eventBus.publish(new WebhookSentEvent('croute', 'lol', '123'));
    return 'Hello World!';
  }
}
