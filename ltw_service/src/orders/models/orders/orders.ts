// TODO:
// import { DefaultOrder } from "../order/default-order/default-order";
// import {OrderOfReqBody} from "../order-of-req-body/order-of-req-body";
import { DefaultBeneficiaryOrdersDataRepo } from "../../../beneficiaries/models/data-repo/beneficiary-orders-data-repo/default/default-beneficiary-orders-data-repo";
import { BeneficiaryOrdersDataRepo } from "../../../beneficiaries/models/data-repo/beneficiary-orders-data-repo/beneficiary-orders-data-repo.interface";
import { BeneficiaryOrder } from "../order/beneficiary-order.interface";
import {NotFoundOrder} from "../order/not-found-order/not-found-order";

export class Orders {
  constructor(
    private _aDataRepo: BeneficiaryOrdersDataRepo = new DefaultBeneficiaryOrdersDataRepo()
  ) {}

  async findOneByOTPandPhoneNumber(
    anOTP: string,
    aPhoneNumber: string
  ): Promise<BeneficiaryOrder> {
    // TODO:
    // const rawBeneficiaryOrder = await this._aDataRepo.findOneByOTPandPhoneNumber(
    //   anOTP,
    //   aPhoneNumber
    // );
    // return rawBeneficiaryOrder
    //   ? new DefaultOrder(rawBeneficiaryOrder)
      // : new NotFoundOrder();
    return new NotFoundOrder()

  }

  async findOneById(
    anId: string
  ): Promise<BeneficiaryOrder> {
    // TODO:
    // const rawBeneficiaryOrder = await this._aDataRepo.findOneById(
    //   anId
    // );
    // return rawBeneficiaryOrder
    //   ? new DefaultOrder(rawBeneficiaryOrder)
    //   : new NotFoundOrder();
    return new NotFoundOrder()
  }

  async findLatestBy(aPhoneNumber: string, ordersToFetch = 10): Promise<any[]>{
    // TODO:
    // const rawBeneficiaryOrders = await this._aDataRepo.findLatestBy(
    //   aPhoneNumber,
    //   ordersToFetch
    // );
    // return rawBeneficiaryOrders.map(rawBeneficiaryOrders => new DefaultOrder(rawBeneficiaryOrders));
    return []
  }

  async completeOrder(anOrder: BeneficiaryOrder) {
    return this._aDataRepo.update(anOrder, { otp: null, success: true });
  }

  async validateOrder(anOrder: BeneficiaryOrder) {
    if (anOrder.isExpired()) {
      await this._aDataRepo.update(anOrder, { otp: null });
      throw new Error("Expired order");
    }
  }

  // TODO:
  // async save(anOrder: OrderOfReqBody): Promise<any> {
  async save(anOrder: any): Promise<any> {
    return this._aDataRepo.save(await anOrder.toJson());
  }
}
