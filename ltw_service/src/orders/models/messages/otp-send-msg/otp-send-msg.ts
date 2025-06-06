import { OTP } from "../../../../beneficiaries/models/otp/otp";
import { SmsMsg } from "../../../../shared/messages/sms-msg.interface";
import { Token } from "../../../../beneficiaries/models/token/token.interface";
import {TranslatedKey} from "../../../../system/multi-language/translated-key/translated-key";

export class OTPSendMsg implements SmsMsg {
  constructor(
    private _otp: OTP,
    private _amount: number,
    private _token: Token
  ) {}

  toString(): string {
    return new TranslatedKey(
      'otpMsg',
      {
        anOTP: this._otp.value(),
        anAmount: this._amount,
        aTokenSymbol: this._token.symbol()
      }).toString()
  }
}
