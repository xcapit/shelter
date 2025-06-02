export interface Beneficiary {
  phoneNumber(): string;
  address(): string;
  countryCode(): string | undefined;
  networkProvider(): string | undefined;
}
