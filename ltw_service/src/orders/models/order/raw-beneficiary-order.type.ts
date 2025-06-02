export type RawBeneficiaryOrder = {
  _id?: string;
  description: string;
  amount: string;
  token: string;
  phoneNumber: string;
  merchAddress: string;
  otp: string;
  expirationDate: number;
  createdAt?: string;
  updatedAt?: string;
  success?: boolean;
};
