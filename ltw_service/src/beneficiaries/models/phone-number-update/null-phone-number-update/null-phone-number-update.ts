import { PhoneNumberUpdate } from "../phone-number-update.interface";

export class NullPhoneNumberUpdate implements PhoneNumberUpdate {
  newPhoneNumber(): string {
    throw new Error();
  }

  actualPhoneNumber(): string {
    throw new Error();
  }

  otp(): string {
    throw new Error();
  }
}
