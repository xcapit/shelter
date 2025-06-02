import { Beneficiaries } from "../../../../beneficiaries/models/beneficiaries/beneficiaries";
import { PhoneNumberUpdate } from "../../../../beneficiaries/models/phone-number-update/phone-number-update.interface";
import { PhoneNumberUpdates } from "../../../../beneficiaries/models/phone-number-updates/phone-number-updates";
import { Command } from "../command.interface";
import {TranslatedKey} from "../../../../system/multi-language/translated-key/translated-key";

export class UpdatePhoneNumberConfirmationCmd implements Command {
  private _newPhoneNumber: string;

  constructor(
    private _aPhoneNumber: string,
    private _params: string[],
    private _beneficiaries: Beneficiaries,
    private _phoneNumberUpdates: PhoneNumberUpdates = new PhoneNumberUpdates()
  ) {}

  private async _execute() {
    const phoneNumberUpdate: PhoneNumberUpdate =
      await this._phoneNumberUpdates.findOneBy(
        this._params[0],
        this._aPhoneNumber
      );
    this._newPhoneNumber = phoneNumberUpdate.newPhoneNumber()

    // TODO:
    // await this._beneficiaries.updatePhoneNumber(
    //   await this._beneficiaries.findOneBy(this._aPhoneNumber),
    //   this._newPhoneNumber
    // );

    await this._phoneNumberUpdates.clearOtp(phoneNumberUpdate);
  }

  async bodyResponse(): Promise<string> {
    await this._execute();
    return `${new TranslatedKey('updatePhoneNumberConfirmationResponse')} ${this._newPhoneNumber}`;
  }

  destinationNumber(): string {
    return this._aPhoneNumber;
  }
}
