export class WebhookSentEvent {
  constructor(
    public readonly payload: any,
    public readonly target: string,
    public readonly idempotentKey: string,
  ) {}
}
