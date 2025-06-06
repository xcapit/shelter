// TODO:
// import { DefaultBeneficiary } from '../../../beneficiaries/models/beneficiary/default-beneficiary/default-beneficiary';
// import { FakeSmartAccount } from '../../../beneficiaries/models/smart-account/fake-smart-account/fake-smart-account';
// import { DefaultToken } from '../../../beneficiaries/models/token/default-token/default-token';
// import { rawBeneficiaryData } from '../../../fixtures/raw-beneficiary-data';
// import { rawOffRampResponse } from '../../../fixtures/raw-off-ramp-response-data';
// import { rawUSDCData } from '../../../fixtures/raw-tokens-data';
// import { FakeOffRampDataRepo } from '../off-ramp-data-repo/fake/fake-off-ramp-data-repo';
// import { FakeProvider } from '../off-ramp-providers/fake-provider/fake-provider';
// import { OffRampService } from './off-ramp-service';
//
// describe('OffRampService', () => {
//   const token = new DefaultToken(rawUSDCData);
//   const aWeiValue = BigInt(1e7);
//   const alchemyPublicClient = {
//     readContract: () => Promise.resolve(aWeiValue),
//   };
//   let offRampService = new OffRampService(
//     new FakeProvider(
//       10,
//       token,
//       'KES',
//       new DefaultBeneficiary(rawBeneficiaryData),
//       new FakeSmartAccount(),
//     ),
//     alchemyPublicClient,
//     new FakeOffRampDataRepo()
//   );
//
//   test('new', () => {
//     expect(offRampService).toBeTruthy();
//   });
//
//   test('should execute offRamp successfully', async () => {
//     expect(await offRampService.process()).toEqual(rawOffRampResponse.fiatTxAmount.toString());
//   });
//
//   test('should throw error when balance is insufficient', async () => {
//     offRampService = new OffRampService(
//       new FakeProvider(
//         1e3,
//         token,
//         'KES',
//         new DefaultBeneficiary(rawBeneficiaryData),
//         new FakeSmartAccount(),
//       ),
//       alchemyPublicClient,
//       new FakeOffRampDataRepo()
//     );
//
//     await expect(offRampService.process()).rejects.toThrow('Invalid amount');
//   });
// });
