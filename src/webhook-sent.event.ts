export class WebhookSentEvent {
  constructor(public readonly payload: any, public readonly target: string) {}
}
