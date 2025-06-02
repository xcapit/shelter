// TODO:
// import i18next from 'i18next';
// import { Beneficiaries } from '../../../../beneficiaries/models/beneficiaries/beneficiaries';
// import { FakeBeneficiariesDataRepo } from '../../../../beneficiaries/models/data-repo/beneficiaries-data-repo/fake/fake-beneficiaries-data-repo';
// import { MultiLanguage } from '../../../../system/multi-language/multi-language';
// import { Command } from '../command.interface';
// import { OffRampCmd } from './offramp-cmd';
// import { FakeSmartAccount } from '../../../../beneficiaries/models/smart-account/fake-smart-account/fake-smart-account';
// import { FakeTwilio } from '../../fake-twilio/fake-twilio';
//
// describe('OffRampCmd', () => {
//   let offRampCmd: Command;
//
//   const aTestPhoneNumber = '1234';
//   const anAmount = '1';
//   const aTokenSymbol = 'USDT';
//   const aCurrencySymbol = 'KES';
//
//   beforeAll(() => {
//     new MultiLanguage(i18next).init();
//   });
//
//   beforeEach(() => {
//     offRampCmd = new OffRampCmd(
//       aTestPhoneNumber,
//       [anAmount, aTokenSymbol, aCurrencySymbol],
//       new Beneficiaries(new FakeBeneficiariesDataRepo(), new FakeTwilio()),
//       new FakeSmartAccount()
//     );
//   });
//
//   test('new', () => {
//     expect(offRampCmd).toBeTruthy();
//   });
//
//   test('bodyResponse', async () => {
//     expect(await offRampCmd.bodyResponse()).toBeTruthy();
//   });
//
//   test('destinationNumber', () => {
//     expect(offRampCmd.destinationNumber()).toEqual(aTestPhoneNumber);
//   });
// });
