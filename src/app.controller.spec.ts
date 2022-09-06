import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { WebhookSagas } from './app.saga';
import { AppService } from './app.service';
import { DistributeWebhookHandler } from './distribute-webhook.handler';

describe('AppController', () => {
  let appController: AppController;
  let spy: jest.SpyInstance;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [AppController],
      providers: [AppService, DistributeWebhookHandler, WebhookSagas],
    }).compile();

    appController = app.get<AppController>(AppController);
    const eventBus = app.get<EventBus>(EventBus);
    spy = jest.spyOn(eventBus, 'publish');
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
      expect(appController.getHello()).toBe('Hello World!');
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });
});
