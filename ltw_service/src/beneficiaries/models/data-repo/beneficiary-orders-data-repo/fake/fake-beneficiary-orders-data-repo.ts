import { rawBeneficiaryData } from "../../../../../fixtures/raw-beneficiary-data";
import { BeneficiaryOrder } from "../../../../../orders/models/order/beneficiary-order.interface";
import { BeneficiaryOrdersDataRepo } from "../beneficiary-orders-data-repo.interface";

export class FakeBeneficiaryOrdersDataRepo
  implements BeneficiaryOrdersDataRepo
{
  constructor(private _findOneByReturn: any = rawBeneficiaryData) {}

  save(rawData: any): Promise<void> {
    return Promise.resolve();
  }

  findOneByOTPandPhoneNumber(anOTP: string, aPhoneNumber: string): Promise<any> {
    return Promise.resolve(this._findOneByReturn);
  }

  findOneById(anId: string): Promise<any> {
    return Promise.resolve(this._findOneByReturn);
  }

  findLatestBy(aPhoneNumber: string, ordersToFetch: number): Promise<any[]>{
    return Promise.resolve(this._findOneByReturn ? [this._findOneByReturn] : []);
  }

  update(anOrder: BeneficiaryOrder, updatedData: any): Promise<any> {
    return Promise.resolve(this._findOneByReturn);
  }

}
