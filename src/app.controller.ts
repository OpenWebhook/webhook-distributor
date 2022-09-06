import {
  Body,
  Controller,
  Headers,
  NotAcceptableException,
  Param,
  Post,
} from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { WebhookSentEvent } from './webhook-sent.event';

@Controller()
export class AppController {
  constructor(private readonly eventBus: EventBus) {}

  @Post('*')
  sendWebhook(
    @Body() body: any,
    @Param() params: string[],
    @Headers('x-idempotent-key') idempotentKey: string | undefined,
    @Headers('x-original-target-host') originalTargetHost: string | undefined,
  ): string {
    if (!originalTargetHost) {
      throw new NotAcceptableException(
        "Missing 'x-original-target-host' header",
      );
    }

    if (!idempotentKey) {
      throw new NotAcceptableException("Missing 'x-idempotent-key' header");
    }
    const path = params['0'] ? `/${params['0']}` : '/';
    const target = originalTargetHost + path;

    this.eventBus.publish(new WebhookSentEvent(body, target, idempotentKey));
    return 'OK';
  }
}
