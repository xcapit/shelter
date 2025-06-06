import { PhoneNumberUpdate } from "../phone-number-update.interface";

export class DefaultPhoneNumberUpdate implements PhoneNumberUpdate {
  constructor(private _aRawData: any) {}

  newPhoneNumber(): string {
    return this._aRawData.newPhoneNumber;
  }

  actualPhoneNumber(): string {
    return this._aRawData.actualPhoneNumber;
  }

  otp(): string {
    return this._aRawData.otp;
  }
}
