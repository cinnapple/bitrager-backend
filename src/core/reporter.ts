import "reflect-metadata";
import { injectable, inject, TYPES } from "../inversify";

import { IncomingWebhook } from "@slack/client";

@injectable()
export default class Reporter implements core.IReporter {
  // private _webClient: WebClient;
  private _webHook: IncomingWebhook;

  constructor(@inject(TYPES.Core.Config) private _config: core.IConfig) {
    // this._webClient = new WebClient(this._config.slack.token);
    this._webHook = new IncomingWebhook(this._config.slack.url);
  }

  notify = (message: string) => {
    this._webHook.send(message).catch(console.error);
  };
}
