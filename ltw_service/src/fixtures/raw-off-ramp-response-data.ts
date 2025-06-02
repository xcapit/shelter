import { OffRampResponse } from "../off-ramp/models/off-ramp-providers/providers-response.interface";
import { rawBeneficiaryData } from "./raw-beneficiary-data";

export const rawOffRampResponse: OffRampResponse = {
  phoneNumber: rawBeneficiaryData.phoneNumber,
  txHash: '0x',
  provider: 'KotaniPay',
  cryptoAmount: 1,
  fiatConversionAmount: 125.5471,
  fiatTxAmount: 124.29,
  fiatCurrency: 'aFiatCurrency',
  token: 'aFromToken',
  fee: 1.255471,
  txReferenceId: 'aReferenceId',
};