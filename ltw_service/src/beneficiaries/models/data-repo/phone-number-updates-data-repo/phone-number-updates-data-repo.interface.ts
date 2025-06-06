import { PhoneNumberUpdate } from "../../phone-number-update/phone-number-update.interface";
import { RawPhoneNumberUpdate } from "../../phone-number-update/raw-phone-number-update.type";

export interface PhoneNumberUpdatesDataRepo {
  save(rawData: RawPhoneNumberUpdate): Promise<any>;
  findOneBy(anOTP: string, aPhoneNumber: string): Promise<any>;
  update(
    aPhoneNumberUpdate: PhoneNumberUpdate,
    updatedData: any
  ): Promise<any>;
}
