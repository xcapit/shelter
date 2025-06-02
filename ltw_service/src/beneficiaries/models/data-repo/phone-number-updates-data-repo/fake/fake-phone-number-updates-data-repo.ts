import { rawPhoneNumberUpdate } from "../../../../../fixtures/raw-phone-number-update-data";
import { PhoneNumberUpdate } from "../../../phone-number-update/phone-number-update.interface";
import { PhoneNumberUpdatesDataRepo } from "../phone-number-updates-data-repo.interface";

export class FakePhoneNumberUpdatesDataRepo
  implements PhoneNumberUpdatesDataRepo
{
  constructor(private _findOneByReturn: any = rawPhoneNumberUpdate) {}

  save(rawData: any): Promise<void> {
    return Promise.resolve();
  }

  findOneBy(anOTP: string, aPhoneNumber: string): Promise<any> {
    return Promise.resolve(this._findOneByReturn);
  }

  update(
    aPhoneNumberUpdate: PhoneNumberUpdate,
    updatedData: any
  ): Promise<any> {
    return Promise.resolve(this._findOneByReturn);
  }
}
