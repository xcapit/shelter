export interface BeneficiaryOrder {
  tokenSymbol(): string;
  phoneNumber(): string;
  amount(): string;
  merchAddress(): string;
  otp(): string;
  isExpired(): boolean;
  status(): string;
}
