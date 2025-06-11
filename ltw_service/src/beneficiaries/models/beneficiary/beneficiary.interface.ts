import { Keypair } from "@stellar/stellar-sdk";

export interface Beneficiary {
  phoneNumber(): string;
  address(): string;
  keypair(): Keypair;
  countryCode(): string | undefined;
  networkProvider(): string | undefined;
}
