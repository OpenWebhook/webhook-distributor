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
      const events$ = of(new WebhookSentEvent(payload, target, idempotentKey));
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

    it('Should return only one command for 2 events chained', () => {
      const events$ = of(
        new WebhookSentEvent(payload, target, idempotentKey),
        new WebhookSentEvent(payload, target, idempotentKey),
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

    it('Should return 2 commands for 2 events separated by more than a second', () => {
      scheduler.run(({ cold, expectObservable }) => {
        const inputObservable = {
          a: new WebhookSentEvent(payload, target, idempotentKey),
        };
        const inputMarbles = '   a 1002ms a';
        const expectedMarble = '1000ms a 1002ms a';
        const expectedObservable = {
          a: new DistributeWebhookCommand(payload, target),
        };
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
      const events$ = of(
        new WebhookSentEvent(payload, target, idempotentKey),
        new WebhookSentEvent(payload, target2, idempotentKey),
      );
      scheduler.run(({ expectObservable }) => {
        const expectedMarble = '(ab|)';
        const expectedObservable = {
          a: new DistributeWebhookCommand(payload, target),
          b: new DistributeWebhookCommand(payload, target2),
        };
        expectObservable(saga.webhookSent(events$)).toBe(
          expectedMarble,
          expectedObservable,
        );
      });
    });
  });

  describe('Multiple idempotent key', () => {
    it('Should return 2 commands for 2 events with different idempotent key', () => {
      const events$ = of(
        new WebhookSentEvent(payload, target, idempotentKey),
        new WebhookSentEvent(payload2, target, idempotentKey2),
      );
      scheduler.run(({ expectObservable }) => {
        const expectedMarble = '(ab|)';
        const expectedObservable = {
          a: new DistributeWebhookCommand(payload, target),
          b: new DistributeWebhookCommand(payload2, target),
        };
        expectObservable(saga.webhookSent(events$)).toBe(
          expectedMarble,
          expectedObservable,
        );
      });
    });
  });

  describe('Multiple idempotent key and targets', () => {
    it('Should return 4 commands for 4 events with different idempotent key and targets', () => {
      const events$ = of(
        new WebhookSentEvent(payload, target, idempotentKey),
        new WebhookSentEvent(payload, target, idempotentKey),
        new WebhookSentEvent(payload2, target, idempotentKey2),
        new WebhookSentEvent(payload2, target, idempotentKey2),
        new WebhookSentEvent(payload, target2, idempotentKey),
        new WebhookSentEvent(payload, target2, idempotentKey),
        new WebhookSentEvent(payload2, target2, idempotentKey2),
        new WebhookSentEvent(payload2, target2, idempotentKey2),
      );
      scheduler.run(({ expectObservable }) => {
        const expectedMarble = '(abcd|)';
        const expectedObservable = {
          a: new DistributeWebhookCommand(payload, target),
          b: new DistributeWebhookCommand(payload2, target),
          c: new DistributeWebhookCommand(payload, target2),
          d: new DistributeWebhookCommand(payload2, target2),
        };
        expectObservable(saga.webhookSent(events$)).toBe(
          expectedMarble,
          expectedObservable,
        );
      });
    });
  });
});
