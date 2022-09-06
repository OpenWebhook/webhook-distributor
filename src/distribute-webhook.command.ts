export class DistributeWebhookCommand {
  constructor(public readonly payload: any, public readonly target: string) {}
}
