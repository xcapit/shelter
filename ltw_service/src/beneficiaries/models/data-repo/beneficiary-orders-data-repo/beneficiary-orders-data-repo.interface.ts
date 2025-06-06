import { BeneficiaryOrder } from "../../../../orders/models/order/beneficiary-order.interface";
import { RawBeneficiaryOrder } from "../../../../orders/models/order/raw-beneficiary-order.type";

export interface BeneficiaryOrdersDataRepo {
  save(rawData: RawBeneficiaryOrder): Promise<any>;
  findOneByOTPandPhoneNumber(anOTP: string, aPhoneNumber: string): Promise<any>;
  findOneById(anId: string): Promise<any>;
  findLatestBy(aPhoneNumber: string, ordersToFetch: number): Promise<any[]>;
  update(anOrder: BeneficiaryOrder, updatedData: any): Promise<any>;
}
