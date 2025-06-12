import { Keypair } from "@stellar/stellar-sdk";
import { Beneficiary } from "../beneficiary.interface";

export class NullBeneficiary implements Beneficiary {

  keypair(): Keypair {
    throw new Error('Beneficiary keypair not found');
  }

  phoneNumber(): string {
    throw new Error('Beneficiary phone number not found');
  }

  address(): string {
    throw new Error('Beneficiary address not found');
  }

  countryCode(): string | undefined {
    throw new Error('Beneficiary country code not found');
  }

  networkProvider(): string | undefined {
    throw new Error('Beneficiary network provider not found');
  }
}
