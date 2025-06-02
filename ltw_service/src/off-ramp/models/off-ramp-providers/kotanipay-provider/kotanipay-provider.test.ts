// TODO:
// import { DefaultToken } from '../../../../beneficiaries/models/token/default-token/default-token';
// import { rawUSDCData } from '../../../../fixtures/raw-tokens-data';
// import { DefaultBeneficiary } from '../../../../beneficiaries/models/beneficiary/default-beneficiary/default-beneficiary';
// import { rawBeneficiaryData } from '../../../../fixtures/raw-beneficiary-data';
// import { KotaniPayProvider } from './kotanipay-provider';
// import { FakeSmartAccount } from '../../../../beneficiaries/models/smart-account/fake-smart-account/fake-smart-account';
// import fetchMock from 'jest-fetch-mock';
// import { rawOffRampResponse } from '../../../../fixtures/raw-off-ramp-response-data';
//
// describe('KotaniPayProvider', () => {
//   let provider: KotaniPayProvider;
//   const token = new DefaultToken(rawUSDCData);
//   const beneficiary = new DefaultBeneficiary(rawBeneficiaryData);
//   const smartAccount = new FakeSmartAccount();
//   const amount = 10;
//   const currency = 'KES';
//   const KotaniPayOffRampResponse = {
//     success: true,
//     data: {
//       referenceId: rawOffRampResponse.txReferenceId,
//       fiatAmount: rawOffRampResponse.fiatConversionAmount,
//       fiatTransactionAmount: rawOffRampResponse.fiatTxAmount,
//       cryptoAmount: rawOffRampResponse.cryptoAmount,
//       fiatCurrency: rawOffRampResponse.fiatCurrency,
//       customerKey: 'aCustomerKey',
//       senderAddress: 'aSenderAddress',
//       status: 'PENDING',
//       onchainStatus: 'PENDING',
//       rate: {
//         from: rawOffRampResponse.token,
//         to: rawOffRampResponse.fiatCurrency,
//         value: (Number(rawOffRampResponse.fiatConversionAmount) / Number(rawOffRampResponse.cryptoAmount)).toString(),
//         fiatAmount: rawOffRampResponse.fiatConversionAmount,
//         transactionAmount: rawOffRampResponse.fiatTxAmount,
//         cryptoAmount: rawOffRampResponse.cryptoAmount,
//         fee: rawOffRampResponse.fee,
//       },
//       escrowAddress: '0xEscrowAddress123',
//     },
//   }
//
//   fetchMock.enableMocks();
//
//   beforeEach(() => {
//     provider = new KotaniPayProvider(
//       amount,
//       token,
//       currency,
//       beneficiary,
//       smartAccount,
//       false,
//     );
//     fetchMock.resetMocks();
//   });
//
//   test('new', () => {
//     expect(provider).toBeTruthy();
//   });
//
//   test('should execute offRamp successfully', async () => {
//     fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
//     fetchMock.mockResponseOnce(
//       JSON.stringify(KotaniPayOffRampResponse),
//     );
//
//     const response = await provider.execute();
//
//     expect(response).toStrictEqual(rawOffRampResponse);
//     expect(fetchMock).toHaveBeenCalledWith(
//       expect.stringContaining('/customer/mobile-money'),
//       expect.objectContaining({
//         method: 'POST',
//         headers: expect.objectContaining({
//           'content-type': 'application/json',
//         }),
//       }),
//     );
//     expect(fetchMock).toHaveBeenCalledWith(
//       expect.stringContaining('/offramp'),
//       expect.objectContaining({
//         method: 'POST',
//         headers: expect.objectContaining({
//           'Content-Type': 'application/json',
//         }),
//       }),
//     );
//   });
//
//   test('should execute offRamp successfully in debug mode', async () => {
//     provider = new KotaniPayProvider(
//       amount,
//       token,
//       currency,
//       beneficiary,
//       smartAccount,
//       true,
//     );
//     fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
//     fetchMock.mockResponseOnce(
//       JSON.stringify(KotaniPayOffRampResponse),
//     );
//
//     const response = await provider.execute();
//
//     expect(response).toStrictEqual(rawOffRampResponse);
//     expect(fetchMock).toHaveBeenCalledWith(
//       expect.stringContaining('/customer/mobile-money'),
//       expect.objectContaining({
//         method: 'POST',
//         headers: expect.objectContaining({
//           'content-type': 'application/json',
//         }),
//         body: expect.stringContaining('"country_code":"GHA"'),
//       }),
//     );
//     expect(fetchMock).toHaveBeenCalledWith(
//       expect.stringContaining('/offramp'),
//       expect.objectContaining({
//         method: 'POST',
//         headers: expect.objectContaining({
//           'Content-Type': 'application/json',
//           Authorization: expect.stringContaining('Bearer '),
//         }),
//         body: expect.stringContaining(`"chain":"POLYGON"`),
//       }),
//     );
//   });
//
//   test('should throw error create customer', async () => {
//     await expect(provider.execute()).rejects.toThrow();
//   });
//
//   test('should throw error offramp request', async () => {
//     fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
//
//     await expect(provider.execute()).rejects.toThrow();
//     expect(fetchMock).toHaveBeenCalledWith(
//       expect.stringContaining('/customer/mobile-money'),
//       expect.objectContaining({
//         method: 'POST',
//         headers: expect.objectContaining({
//           'content-type': 'application/json',
//         }),
//       }),
//     );
//   });
//
//   test('should return correct amount', () => {
//     expect(provider.amount()).toBe(amount);
//   });
//
//   test('should return correct token', () => {
//     expect(provider.token()).toBe(token);
//   });
//
//   test('should return correct currency', () => {
//     expect(provider.currency()).toBe(currency);
//   });
//
//   test('should return correct beneficiary', () => {
//     expect(provider.beneficiary()).toBe(beneficiary);
//   });
// });
