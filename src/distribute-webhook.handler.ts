import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppService } from './app.service';
import { DistributeWebhookCommand } from './distribute-webhook.command';

@CommandHandler(DistributeWebhookCommand)
export class DistributeWebhookHandler
  implements ICommandHandler<DistributeWebhookCommand>
{
  constructor(private readonly appService: AppService) {}

  async execute(command: DistributeWebhookCommand) {
    const { payload } = command;
    console.log(payload);
    const result = this.appService.getHello();
    console.log('result', result);
  }
}
