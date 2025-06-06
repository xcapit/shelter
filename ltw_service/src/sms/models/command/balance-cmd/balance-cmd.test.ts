// TODO:
// import { Beneficiaries } from "../../../../beneficiaries/models/beneficiaries/beneficiaries";
// import { FakeBeneficiariesDataRepo } from "../../../../beneficiaries/models/data-repo/beneficiaries-data-repo/fake/fake-beneficiaries-data-repo";
// import { Command } from "../command.interface";
// import { BalanceCmd } from "./balance-cmd";
// import {MultiLanguage} from "../../../../system/multi-language/multi-language";
// import i18next from "i18next";
// import { FakeTwilio } from "../../fake-twilio/fake-twilio";

// describe("BalanceCmd", () => {
//   let balanceCmd: Command;
//   const aWeiValue = BigInt(1000000);
//   const tokenSymbol = "USDT";
//   const aTestPhoneNumber = "1234";

//   beforeAll(() => {
//     new MultiLanguage(i18next).init();
//   });

//   beforeEach(() => {
//     balanceCmd = new BalanceCmd(
//       [tokenSymbol],
//       aTestPhoneNumber,
//       new Beneficiaries(new FakeBeneficiariesDataRepo(), new FakeTwilio()),
//       {
//         readContract: () => Promise.resolve(aWeiValue),
//       }
//     );
//   });

//   test("new", () => {
//     expect(balanceCmd).toBeTruthy();
//   });

//   test("bodyResponse", async () => {
//     expect(await balanceCmd.bodyResponse()).toContain(`${tokenSymbol}`);
//   });

//   test("bodyResponse with error", async () => {
//     expect(
//       await new BalanceCmd(
//         ["ANOTHER"],
//         "",
//         new Beneficiaries(new FakeBeneficiariesDataRepo(), new FakeTwilio()),
//         {
//           readContract: () => Promise.resolve(aWeiValue),
//         }
//       ).bodyResponse()
//     ).toContain("Balance error");
//   });

//   test("destinationNumber", () => {
//     expect(balanceCmd.destinationNumber()).toEqual(aTestPhoneNumber);
//   });
// });
