import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { debounce, interval, map, Observable } from 'rxjs';
import { DistributeWebhookCommand } from './distribute-webhook.command';
import { WebhookSentEvent } from './webhook-sent.event';

@Injectable()
export class WebhookSagas {
  @Saga()
  webhookSent = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(WebhookSentEvent),
      debounce(() => interval(200)),
      map((event) => new DistributeWebhookCommand(event.payload, event.target)),
    );
  };
}
