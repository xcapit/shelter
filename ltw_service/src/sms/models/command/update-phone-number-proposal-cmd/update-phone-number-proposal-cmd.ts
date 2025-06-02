import {OTP} from "../../../../beneficiaries/models/otp/otp";
import {PhoneNumberUpdates} from "../../../../beneficiaries/models/phone-number-updates/phone-number-updates";
import {Command} from "../command.interface";
import {TranslatedKey} from "../../../../system/multi-language/translated-key/translated-key";

export class UpdatePhoneNumberProposalCmd implements Command {
  private _otp: OTP;

  constructor(
    private _aPhoneNumber: string,
    private _params: string[],
    private _phoneNumberUpdates: PhoneNumberUpdates = new PhoneNumberUpdates(),
  ) {
  }

  destinationNumber(): string {
    return this._params[0];
  }

  private async _execute() {
    this._otp = new OTP();
    await this._phoneNumberUpdates.save(
      this._otp,
      this._aPhoneNumber,
      this._params[0]
    );
  }

  async bodyResponse(): Promise<string> {
    await this._execute();
    return new TranslatedKey('updatePhoneNumberResponse', {
      aFromPhoneNumber: this._aPhoneNumber,
      aToPhoneNumber: this._params[0],
      anOTP: this._otp.value()
    }).toString();
  }
}
