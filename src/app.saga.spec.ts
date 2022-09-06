import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { WebhookSagas } from './app.saga';
import { DistributeWebhookCommand } from './distribute-webhook.command';
import { WebhookSentEvent } from './webhook-sent.event';

const payload = 'croute';
const payload2 = 'croute2';
const target = 'http://croute.fr';
const target2 = 'http://target2.com';
const idempotentKey = 'idempotentKey';
const idempotentKey2 = 'idempotentKey2';

const expectedObservable = {
  a: new DistributeWebhookCommand(payload, target),
  b: new DistributeWebhookCommand(payload, target2),
  c: new DistributeWebhookCommand(payload2, target),
  d: new DistributeWebhookCommand(payload2, target2),
};

const inputObservable = {
  a: new WebhookSentEvent(payload, target, idempotentKey),
  b: new WebhookSentEvent(payload, target2, idempotentKey),
  c: new WebhookSentEvent(payload2, target, idempotentKey2),
  d: new WebhookSentEvent(payload2, target2, idempotentKey2),
};

describe('WebhookSaga', () => {
  let scheduler: TestScheduler;
  const saga = new WebhookSagas();

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('Debounce', () => {
    it('Should return a command', () => {
      scheduler.run(({ expectObservable, cold }) => {
        const inputMarbles = '(a|)';
        const expectedMarble = '(a|)';

        const events$ = cold(inputMarbles, inputObservable);
        expectObservable(saga.webhookSent(events$)).toBe(
          expectedMarble,
          expectedObservable,
        );
      });
    });

    it('Should return only one command for 2 events chained', () => {
      scheduler.run(({ expectObservable, cold }) => {
        const inputMarbles = '(aa|)';
        const expectedMarble = '(a|)';

        const events$ = cold(inputMarbles, inputObservable);
        expectObservable(saga.webhookSent(events$)).toBe(
          expectedMarble,
          expectedObservable,
        );
      });
    });

    it('Should return 2 commands for 2 events separated by more than a second', () => {
      scheduler.run(({ cold, expectObservable }) => {
        const inputMarbles = '  a      1002ms a';
        const expectedMarble = '1000ms a      1002ms a';

        const events$ = cold(inputMarbles, inputObservable);
        expectObservable(saga.webhookSent(events$)).toBe(
          expectedMarble,
          expectedObservable,
        );
      });
    });
  });

  describe('Multiple targets', () => {
    it('Should return 2 commands for 2 events with different targets', () => {
      scheduler.run(({ expectObservable, cold }) => {
        const inputMarbles = '(ab|)';
        const expectedMarble = '(ab|)';

        const events$ = cold(inputMarbles, inputObservable);
        expectObservable(saga.webhookSent(events$)).toBe(
          expectedMarble,
          expectedObservable,
        );
      });
    });
  });

  describe('Multiple idempotent key', () => {
    it('Should return 2 commands for 2 events with different idempotent key', () => {
      scheduler.run(({ expectObservable, cold }) => {
        const inputMarbles = '(ac|)';
        const expectedMarble = '(ac|)';

        const events$ = cold(inputMarbles, inputObservable);
        expectObservable(saga.webhookSent(events$)).toBe(
          expectedMarble,
          expectedObservable,
        );
      });
    });
  });

  describe('Multiple idempotent key and targets', () => {
    it('Should return 4 commands for 4 events with different idempotent key and targets', () => {
      scheduler.run(({ expectObservable, cold }) => {
        const inputMarbles = '         aabbccddaaa';
        const expectedMarble = '1000ms ---b-c-d--a';

        const events$ = cold(inputMarbles, inputObservable);
        expectObservable(saga.webhookSent(events$)).toBe(
          expectedMarble,
          expectedObservable,
        );
      });
    });
  });
});
