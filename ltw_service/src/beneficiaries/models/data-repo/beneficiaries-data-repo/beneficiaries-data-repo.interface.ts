import { Beneficiary } from "../../beneficiary/beneficiary.interface";
import { RawBeneficiary } from "../../beneficiary/raw-beneficiary.type";

export interface BeneficiariesDataRepo {
  save(rawData: RawBeneficiary): Promise<any>;
  findOneBy(phoneNumber: string): Promise<any>;
  findSecretsBy(phoneNumber: string): Promise<any>;
  update(aBeneficiary: Beneficiary, updatedData: any): Promise<any>;
  updatePhoneNumber(aBeneficiary: Beneficiary, phoneNumber: string): Promise<any>
}
