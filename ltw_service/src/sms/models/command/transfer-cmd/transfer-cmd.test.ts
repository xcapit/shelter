// TODO:
// import { FakeSmartAccount } from '../../../../beneficiaries/models/smart-account/fake-smart-account/fake-smart-account';
// import { Command } from '../command.interface';
// import { TransferCmd } from './transfer-cmd';
// import { MultiLanguage } from '../../../../system/multi-language/multi-language';
// import i18next from 'i18next';
// import { Beneficiaries } from '../../../../beneficiaries/models/beneficiaries/beneficiaries';
// import { FakeBeneficiariesDataRepo } from '../../../../beneficiaries/models/data-repo/beneficiaries-data-repo/fake/fake-beneficiaries-data-repo';
// import { FakeTwilio } from '../../fake-twilio/fake-twilio';
//
// describe('TransferCmd', () => {
//   let transferCmd: Command;
//   const aWeiValue = BigInt(1112000);
//
//   const aTestPhoneNumber = '1234';
//   beforeAll(() => {
//     new MultiLanguage(i18next).init();
//   });
//
//   beforeEach(() => {
//     transferCmd = new TransferCmd(
//       aTestPhoneNumber,
//       ['USDT', '10', 'Ox1'],
//       new FakeSmartAccount(),
//       new Beneficiaries(new FakeBeneficiariesDataRepo(), new FakeTwilio()),
//       {
//         readContract: () => Promise.resolve(aWeiValue),
//       },
//     );
//   });
//
//   test("new", () => {
//     expect(transferCmd).toBeTruthy();
//   });
//
//   test.only("success bodyResponse", async () => {
//     expect(await transferCmd.bodyResponse()).toEqual("Your tokens have been sent! Transaction hash: 0x. Your balance is: 1.11 USDT.");
//   });
//
//   [
//     {
//       name: "with throw error from smart account",
//       params: ["USDT", "10", "0x1"],
//       smartAccount: new FakeSmartAccount("", "", "", true),
//     },
//     {
//       name: "with unknown token",
//       params: ["USOMG", "10", "0x1"],
//       smartAccount: new FakeSmartAccount(),
//     },
//     {
//       name: "with wrong params",
//       params: ["USDT"],
//       smartAccount: new FakeSmartAccount(),
//     },
//   ].forEach((testCase) => {
//     test(`bodyResponse fail ${testCase.name}`, async () => {
//       const transferCmd = new TransferCmd(
//         aTestPhoneNumber,
//         testCase.params,
//         testCase.smartAccount,
//         new Beneficiaries(new FakeBeneficiariesDataRepo(), new FakeTwilio()),
//       {
//         readContract: () => Promise.resolve(aWeiValue),
//       },
//       );
//
//       expect(await transferCmd.bodyResponse()).toContain("failed");
//     });
//   });
//
//   test("destinationNumber", () => {
//     expect(transferCmd.destinationNumber()).toEqual(aTestPhoneNumber);
//   });
// });
