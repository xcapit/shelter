import { Model } from 'mongoose';
import { BeneficiariesDataRepo } from '../beneficiaries-data-repo.interface';
import { BeneficiariesModel } from '../../../../../db/mongo/beneficiaries.model';
import { RawBeneficiary } from '../../../beneficiary/raw-beneficiary.type';
import { Beneficiary } from '../../../beneficiary/beneficiary.interface';

export class DefaultBeneficiariesDataRepo implements BeneficiariesDataRepo {
  constructor(private _aModel: Model<any> = BeneficiariesModel) {}

  save(rawData: RawBeneficiary): Promise<any> {
    return this._aModel.create(rawData);
  }

  findOneBy(aPhoneNumber: string): Promise<any> {
    return this._aModel
      .findOne(
        { phoneNumber: aPhoneNumber, active: true },
        'phoneNumber address ownerAddress countryCode networkProvider',
      )
      .lean();
  }

  findSecretsBy(aPhoneNumber: string): Promise<any> {
    return this._aModel
      .findOne({ phoneNumber: aPhoneNumber, active: true }, 'ownerSecrets')
      .lean();
  }

  update(aBeneficiary: Beneficiary, updatedData: any): Promise<any> {
    return this._aModel
      .findOneAndUpdate(
        { phoneNumber: aBeneficiary.phoneNumber(), active: true },
        updatedData
      )
      .lean();
  }

  updatePhoneNumber(aBeneficiary: Beneficiary, phoneNumber: string): Promise<any> {
    return this._aModel
      .findOneAndUpdate(
        { phoneNumber: aBeneficiary.phoneNumber(), active: true },
        {
          $set: {
            phoneNumber: phoneNumber,
          },
          $unset: {
            networkProvider: "",
            countryCode: "",
          },
        },
      )
      .lean();
  }
}
