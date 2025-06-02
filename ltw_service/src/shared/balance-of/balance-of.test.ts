// TODO:
// import { rawUSDCData } from "../../fixtures/raw-tokens-data";
// import { smartAccountAddress } from "../../fixtures/raw-wallet-data";
// import { DefaultToken } from "../../beneficiaries/models/token/default-token/default-token";
// import { BalanceOf } from "./balance-of";

// describe("BalanceOf", () => {
//   const aWeiValue = BigInt(1000000);
//   const aToken = new DefaultToken(rawUSDCData);
//   let balance: BalanceOf;

//   beforeEach(() => {
//     balance = new BalanceOf(aToken, smartAccountAddress, {
//       readContract: () => Promise.resolve(aWeiValue),
//     });
//   });

//   test("new", () => {
//     expect(balance).toBeTruthy();
//   });

//   test("toAmount", async () => {
//     expect((await balance.toAmount()).value()).toEqual(1);
//   });

//   test("toJson", async () => {
//     expect((await balance.toJson()).token).toEqual(aToken.symbol());
//     expect((await balance.toJson()).balance).toEqual(1);
//   });
// });
