// TODO:
// import { rawBeneficiaryData } from "../../../fixtures/raw-beneficiary-data";
// import { rawUSDCData } from "../../../fixtures/raw-tokens-data";
// import { DefaultToken } from "../token/default-token/default-token";
// import { TransferTransaction } from "../transfer-transaction/transfer-transaction";
// import { UserOperation } from "./user-operation";

// describe("UserOperation", () => {
//   let userOperation: UserOperation;

//   beforeEach(() => {
//     userOperation = new UserOperation(
//       new TransferTransaction(
//         new DefaultToken(rawUSDCData),
//         rawBeneficiaryData.address,
//         BigInt(1e18)
//       )
//     );
//   });

//   test("new", () => {
//     expect(userOperation).toBeTruthy();
//   });

//   test("toJSON", () => {
//     expect(userOperation.toJSON()).toBeTruthy();
//   });
// });
