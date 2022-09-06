import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { WebhookSagas } from './app.saga';
import { DistributeWebhookCommand } from './distribute-webhook.command';
import { WebhookSentEvent } from './webhook-sent.event';

const payload = 'croute';
const target = 'http://croute.fr';

describe('WebhookSaga', () => {
  let scheduler: TestScheduler;
  const saga = new WebhookSagas();

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('root', () => {
    it('Should return a command', () => {
      const events$ = of(new WebhookSentEvent(payload, target));
      scheduler.run(({ expectObservable }) => {
        const expectedMarble = '(a|)';
        const expectedObservable = {
          a: new DistributeWebhookCommand(payload, target),
        };
        expectObservable(saga.webhookSent(events$)).toBe(
          expectedMarble,
          expectedObservable,
        );
      });
    });

    it('Should return only one command for 2 events', () => {
      const events$ = of(
        new WebhookSentEvent(payload, target),
        new WebhookSentEvent(payload, target),
      );
      scheduler.run(({ expectObservable }) => {
        const expectedMarble = '(a|)';
        const expectedObservable = {
          a: new DistributeWebhookCommand(payload, target),
        };
        expectObservable(saga.webhookSent(events$)).toBe(
          expectedMarble,
          expectedObservable,
        );
      });
    });
  });
});
