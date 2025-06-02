import { Beneficiary } from "../beneficiary.interface";

export class NullBeneficiary implements Beneficiary {
  phoneNumber(): string {
    throw new Error('Beneficiary phone number not found');
  }

  address(): string {
    throw new Error('Beneficiary address not found');
  }

  countryCode(): string | undefined{
    throw new Error('Beneficiary country code not found');
  }

  networkProvider(): string | undefined {
    throw new Error('Beneficiary network provider not found');
  }
}
