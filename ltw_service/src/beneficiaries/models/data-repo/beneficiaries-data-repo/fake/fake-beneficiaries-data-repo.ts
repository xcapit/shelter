import { rawBeneficiaryData } from "../../../../../fixtures/raw-beneficiary-data";
import { Beneficiary } from "../../../beneficiary/beneficiary.interface";
import { BeneficiariesDataRepo } from "../beneficiaries-data-repo.interface";

export class FakeBeneficiariesDataRepo implements BeneficiariesDataRepo {
  constructor(private _findOneByReturn: any = rawBeneficiaryData) {}

  save(rawData: any): Promise<void> {
    return Promise.resolve();
  }

  findOneBy(phoneNumber: string): Promise<any> {
    return Promise.resolve(this._findOneByReturn);
  }

  findSecretsBy(phoneNumber: string): Promise<any> {
    return Promise.resolve(rawBeneficiaryData);
  }

  update(aBeneficiary: Beneficiary, updatedData: any): Promise<any> {
    return Promise.resolve({ 
      ...rawBeneficiaryData,
      ...updatedData        
    });
  }

  updatePhoneNumber(aBeneficiary: Beneficiary, phoneNumber: string): Promise<any> {
    return Promise.resolve({ 
      ...rawBeneficiaryData,
      ...{phoneNumber: phoneNumber, countryCode: undefined, networkProvider: undefined}        
    });
  }
}
