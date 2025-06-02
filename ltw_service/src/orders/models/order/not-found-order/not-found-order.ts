import { BeneficiaryOrder } from "../beneficiary-order.interface";

export class NotFoundOrder implements BeneficiaryOrder {

  phoneNumber(): string {
    throw new Error('Order beneficiary phone number not found');
  }

  tokenSymbol(): string {
    throw new Error('Order token symbol not found');
  }

  amount(): string {
    throw new Error('Order amount not found');
  }

  merchAddress(): string {
    throw new Error('Order merch address not found');
  }

  otp(): string {
    throw new Error('Order otp not found');
  }

  isExpired(): boolean {
    throw new Error('Order not found');
  }

  status(): string {
    throw new Error('Order not found');
  }
}
