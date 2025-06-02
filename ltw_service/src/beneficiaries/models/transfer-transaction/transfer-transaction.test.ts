// TODO:
// import { rawBeneficiaryData } from "../../../fixtures/raw-beneficiary-data";
// import { rawUSDCData } from "../../../fixtures/raw-tokens-data";
// import { DefaultToken } from "../token/default-token/default-token";
// import { TransferTransaction } from "./transfer-transaction";

// describe("TransferTransaction", () => {
//   let transferTransaction: TransferTransaction;

//   beforeEach(() => {
//     transferTransaction = new TransferTransaction(
//       new DefaultToken(rawUSDCData),
//       rawBeneficiaryData.address,
//       BigInt(1e18)
//     );
//   });

//   test("new", () => {
//     expect(transferTransaction).toBeTruthy();
//   });

//   test("toHex", () => {
//     expect(transferTransaction.toHex()).toEqual(
//       "0xa9059cbb000000000000000000000000f369277650ad6654f25412ea8bfbd5942733babc0000000000000000000000000000000000000000000000000de0b6b3a7640000"
//     );
//   });

//   test("tokenAddress", () => {
//     expect(transferTransaction.tokenAddress()).toEqual(rawUSDCData.contract);
//   });
// });
