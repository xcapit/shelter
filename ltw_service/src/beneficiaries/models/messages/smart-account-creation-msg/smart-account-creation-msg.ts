import { SmsMsg } from "../../../../shared/messages/sms-msg.interface";
import {TranslatedKey} from "../../../../system/multi-language/translated-key/translated-key";

export class SmartAccountCreationMsg implements SmsMsg {
  constructor(private _aSmartAccountAddress: string) {}

  toString(): string {
    return `${new TranslatedKey('accountCreationMsg').toString()}`;
  }
}
