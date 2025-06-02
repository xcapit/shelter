// TODO:
// import { Hex } from "viem";
// import {
//   smartAccountAddress,
//   ownerAddress,
// } from "../../../../fixtures/raw-wallet-data";
// import { SmartAccount } from "../smart-account";
// import { FakeSmartAccount } from "./fake-smart-account";
//
// describe("FakeSmartAccount", () => {
//   let smartAccount: SmartAccount;
//
//   beforeEach(() => {
//     smartAccount = new FakeSmartAccount();
//   });
//
//   test("new", () => {
//     expect(smartAccount).toBeTruthy();
//   });
//
//   test("address", async () => {
//     const smartAccount = new FakeSmartAccount(smartAccountAddress);
//
//     expect(await smartAccount.address()).toEqual(smartAccountAddress);
//   });
//
//   test("owner address", async () => {
//     const smartAccount = new FakeSmartAccount("", ownerAddress);
//
//     expect(await smartAccount.ownerAddress()).toEqual(ownerAddress);
//   });
//
//   test("owner private key", async () => {
//     const smartAccount = new FakeSmartAccount();
//
//     expect(await smartAccount.ownerPrivateKey()).toEqual("" as Hex);
//   });
//
//   test("send user operation", async () => {
//     expect(await smartAccount.send([])).toEqual("");
//   });
//
//   test("transaction hash of", async () => {
//     expect(await smartAccount.transactionHashOf("")).toEqual("0x" as Hex);
//   });
//
//   test("send user operation failed", async () => {
//     expect(
//       async () => await new FakeSmartAccount("", "", "", true).send([])
//     ).rejects.toThrow();
//   });
// });
