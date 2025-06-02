import { Model, Types } from "mongoose";
import { BeneficiaryOrdersModel } from "../../../../../db/mongo/beneficiary-orders.model";
import { BeneficiaryOrdersDataRepo } from "../beneficiary-orders-data-repo.interface";
import { BeneficiaryOrder } from "../../../../../orders/models/order/beneficiary-order.interface";
import { RawBeneficiaryOrder } from "../../../../../orders/models/order/raw-beneficiary-order.type";

export class DefaultBeneficiaryOrdersDataRepo
  implements BeneficiaryOrdersDataRepo
{
  constructor(private _aModel: Model<any> = BeneficiaryOrdersModel) {}

  save(rawData: RawBeneficiaryOrder): Promise<any> {
    return this._aModel.create(rawData);
  }

  findOneByOTPandPhoneNumber(anOTP: string, aPhoneNumber: string): Promise<any> {
    return this._aModel
      .findOne({ otp: anOTP, phoneNumber: aPhoneNumber })
      .lean();
  }

  private _validateId(anId: string): void{
    if (!Types.ObjectId.isValid(anId)){
      throw new Error("Invalid Id format");
    }
  }

  findOneById(anId: string): Promise<any> {
    this._validateId(anId);
    return this._aModel
      .findOne({ _id: anId})
      .lean();
  }

  findLatestBy(aPhoneNumber: string, ordersToFetch = 10): Promise<any[]> {
    return this._aModel
      .find({ phoneNumber: aPhoneNumber })
      .sort({ createdAt: -1 })
      .limit(ordersToFetch)
      .lean();
  }

  update(anOrder: BeneficiaryOrder, updatedData: any): Promise<any> {
    return this._aModel
      .findOneAndUpdate(
        { otp: anOrder.otp(), phoneNumber: anOrder.phoneNumber() },
        updatedData
      )
      .lean();
  }
}
