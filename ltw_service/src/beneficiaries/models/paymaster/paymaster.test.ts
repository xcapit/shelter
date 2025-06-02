// TODO:
// import { Paymaster } from './paymaster';
// import { AlchemyConfig } from '../alchemy-config/alchemy-config';
// import { smartAccountAddress } from '../../../fixtures/raw-wallet-data';

// describe('Paymaster', () => {
//   const thirdPartyPaymasterConfiguredEnv = {
//     THIRD_PARTY_PAYMASTER_URL: 'https://apaymaster.com',
//     THIRD_PARTY_PAYMASTER_NAME: 'generic',
//     THIRD_PARTY_PAYMASTER_ADDRESS: '0x0',
//   };
//   const thirdPartyPaymasterNotConfiguredEnv = {};
//   const aUserOperationHash = '0xa3';
//   const aTxHash = '0xb4';
//   const aCreationClient = () => {
//     return Promise.resolve({
//       getAddress: () => smartAccountAddress,
//       sendUserOperation: () => Promise.resolve({ hash: aUserOperationHash }),
//       waitForUserOperationTransaction: () => Promise.resolve(aTxHash),
//     });
//   };
//   const anAccount = {};
//   const httpClient = { post: () => Promise.resolve({}) };
//   test('config return alchemy paymaster', () => {
//     const aPaymaster = new Paymaster(
//       new AlchemyConfig(),
//       anAccount,
//       aCreationClient,
//       aCreationClient,
//       thirdPartyPaymasterNotConfiguredEnv,
//       httpClient,
//     );

//     const paymasterConfig = aPaymaster.config();

//     expect(paymasterConfig).toHaveProperty('policyId');
//     expect(aPaymaster.client()).toBeTruthy();
//   });

//   test('config return generic paymaster', () => {
//     const aPaymaster = new Paymaster(
//       new AlchemyConfig(),
//       anAccount,
//       aCreationClient,
//       aCreationClient,
//       thirdPartyPaymasterConfiguredEnv,
//       httpClient,
//     );

//     const paymasterConfig = aPaymaster.config();

//     expect(paymasterConfig).toHaveProperty('paymasterAndData');
//     expect(paymasterConfig).toHaveProperty('dummyPaymasterAndData');
//     expect(aPaymaster.client()).toBeTruthy();
//   });
// });
