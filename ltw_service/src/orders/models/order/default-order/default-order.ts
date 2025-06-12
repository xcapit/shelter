import { Address } from "../../../../beneficiaries/models/address/address";
import { BeneficiaryOrder } from "../beneficiary-order.interface";
import { RawBeneficiaryOrder } from "../raw-beneficiary-order.type";

export class DefaultOrder implements BeneficiaryOrder {
  constructor(private rawBeneficiaryOrder: RawBeneficiaryOrder) { }

  tokenSymbol(): string {
    return this.rawBeneficiaryOrder.token;
  }

  phoneNumber(): string {
    return this.rawBeneficiaryOrder.phoneNumber;
  }

  amount(): string {
    return this.rawBeneficiaryOrder.amount;
  }

  merchAddress(): string {
    return new Address(this.rawBeneficiaryOrder.merchAddress).toString();
  }

  otp(): string {
    return this.rawBeneficiaryOrder.otp;
  }

  isExpired(): boolean {
    return new Date(this.rawBeneficiaryOrder.expirationDate) < new Date()
  }

  description(): string {
    return this.rawBeneficiaryOrder.description;
  }

  id(): string | undefined {
    return this.rawBeneficiaryOrder._id;
  }

  createdAt(): string | undefined {
    return this.rawBeneficiaryOrder.createdAt;
  }

  updatedAt(): string | undefined {
    return this.rawBeneficiaryOrder.updatedAt;
  }

  success(): boolean | undefined {
    return this.rawBeneficiaryOrder.success;
  }

  status(): string {
    let msg = 'Order pending completion';
    if (this.success()) {
      msg = 'Order successfully completed';
    } else if (this.isExpired()) {
      msg = 'Order expired';
    }
    return msg;
  }
}
