import { Model } from "mongoose";
import { PhoneNumberUpdatesDataRepo } from "../phone-number-updates-data-repo.interface";
import { PhoneNumberUpdatesModel } from "../../../../../db/mongo/phone-number-updates.model";
import { PhoneNumberUpdate } from "../../../phone-number-update/phone-number-update.interface";
import { RawPhoneNumberUpdate } from "../../../phone-number-update/raw-phone-number-update.type";

export class DefaultPhoneNumberUpdatesDataRepo
  implements PhoneNumberUpdatesDataRepo
{
  constructor(private _aModel: Model<any> = PhoneNumberUpdatesModel) {}

  save(rawData: RawPhoneNumberUpdate): Promise<any> {
    return this._aModel.create(rawData);
  }

  findOneBy(anOTP: string, aPhoneNumber: string): Promise<any> {
    return this._aModel
      .findOne({ otp: anOTP, actualPhoneNumber: aPhoneNumber })
      .lean();
  }

  update(
    aPhoneNumberUpdate: PhoneNumberUpdate,
    updatedData: any
  ): Promise<any> {
    return this._aModel
      .findOneAndUpdate(
        {
          otp: aPhoneNumberUpdate.otp(),
          actualPhoneNumber: aPhoneNumberUpdate.actualPhoneNumber(),
        },
        updatedData
      )
      .lean();
  }
}
