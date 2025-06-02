export interface OffRampResponse {
  phoneNumber: string,
  txHash: string,
  provider: string,
  cryptoAmount: number,
  fiatConversionAmount: number,
  fiatTxAmount: number,
  fiatCurrency: string,
  token: string,
  fee: number,
  txReferenceId: string,
}
