import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { debounceTime, groupBy, map, mergeAll, Observable } from 'rxjs';
import { DistributeWebhookCommand } from './distribute-webhook.command';
import { WebhookSentEvent } from './webhook-sent.event';

@Injectable()
export class WebhookSagas {
  @Saga()
  webhookSent = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(WebhookSentEvent),
      groupBy((event) => event.target + event.idempotentKey),
      map((group) => group.pipe(debounceTime(1000))),
      mergeAll(),
      map((event) => new DistributeWebhookCommand(event.payload, event.target)),
    );
  };
}
