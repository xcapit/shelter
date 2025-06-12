import { DefaultOrder } from '../order/default-order/default-order';

export class BeneficiaryOrderResponse {
  constructor(private order: DefaultOrder) {}

  public toJSON() {
    return {
      _id: this.order.id(),
      amount: this.order.amount(),
      token: this.order.tokenSymbol(),
      phoneNumber: this.order.phoneNumber(),
      merchAddress: this.order.merchAddress(),
      description: this.order.description(),
      createdAt: this.order.createdAt(),
      updatedAt: this.order.updatedAt(),
      success: this.order.success(),
    };
  }
}
