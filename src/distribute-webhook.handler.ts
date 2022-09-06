import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppService } from './app.service';
import { DistributeWebhookCommand } from './distribute-webhook.command';

@CommandHandler(DistributeWebhookCommand)
export class DistributeWebhookHandler
  implements ICommandHandler<DistributeWebhookCommand>
{
  constructor(private readonly appService: AppService) {}

  async execute(command: DistributeWebhookCommand) {
    console.log(command);
    this.appService.distributeWebhook(command.target, command.payload);
  }
}
