// TODO:
// import { DefaultBeneficiary } from "../../../../beneficiaries/models/beneficiary/default-beneficiary/default-beneficiary";
// import { FakeSmartAccount } from "../../../../beneficiaries/models/smart-account/fake-smart-account/fake-smart-account";
// import { DefaultToken } from "../../../../beneficiaries/models/token/default-token/default-token";
// import { rawBeneficiaryData } from "../../../../fixtures/raw-beneficiary-data";
// import { rawUSDCData } from "../../../../fixtures/raw-tokens-data";
// import { FakeProvider } from "./fake-provider";
//
// describe('FakeProvider', () => {
//   let provider: FakeProvider;
//
//   beforeEach(() => {
//     const token = new DefaultToken(rawUSDCData);
//     provider = new FakeProvider(
//       10,
//       token,
//       'KES',
//       new DefaultBeneficiary(rawBeneficiaryData),
//       new FakeSmartAccount()
//     );
//   });
//
//   test('new', () => {
//     expect(provider).toBeTruthy();
//   });
//
//   test('execute', () => {
//     expect(provider.execute()).toBeTruthy();
//   });
//
//   test('currency', () => {
//     expect(provider.currency()).toEqual('KES');
//   });
// })
