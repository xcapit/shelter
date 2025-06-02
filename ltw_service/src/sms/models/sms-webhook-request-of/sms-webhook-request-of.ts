import {Request} from 'express';
import twilio from "twilio";
const { validateRequest } = twilio;

export class SMSWebhookRequestOf {

  constructor(
    private _aRequest: Request,
    private _authToken: string,
    private _webhookUrl: string,
  ) {
    this._validate();
  }

  body(): any {
    return this._aRequest.body;
  }

  private _validate() {
    if(!validateRequest(
      this._authToken,
      this._aRequest.header('X-Twilio-Signature')!,
      this._webhookUrl,
      this._aRequest.body
    )) {
      throw new Error('Invalid webhook request');
    }
  }
}
