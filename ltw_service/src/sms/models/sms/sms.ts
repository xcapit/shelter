import { SMSClient } from "../sms-client/sms-client.interface";
import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";

export class SMS {
  constructor(
    private _toPhoneNumber: string,
    private _aMessage: string,
    private _aSMSClient: SMSClient
  ) {}

  async send(): Promise<MessageInstance> {
    return this._aSMSClient.send(this._toPhoneNumber, this._aMessage);
  }
}
