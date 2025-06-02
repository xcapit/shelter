// TODO::
// import { Hex } from "viem";
// import { AlchemyConfig } from "../../alchemy-config/alchemy-config";
// import { SmartAccount } from "../smart-account";
// import { AlchemySmartAccount } from "./alchemy-smart-account";
// import dotenv from "dotenv";
// import process from "process";
// import { UserOperation } from "../../user-operation/user-operation";
// import { rawUSDCData } from "../../../../fixtures/raw-tokens-data";
// import { DefaultToken } from "../../token/default-token/default-token";
// import { TransferTransaction } from "../../transfer-transaction/transfer-transaction";
// import { smartAccountAddress } from "../../../../fixtures/raw-wallet-data";
// import { GeneratedPrivateKey } from "../../private-key/generated-private-key/generated-private-key";
// import { rawBeneficiaryData } from "../../../../fixtures/raw-beneficiary-data";
//
// dotenv.config();
//
// describe("AlchemySmartAccount", () => {
//   const { TEST_PRIVATE_KEY, TEST_OWNER_ADDRESS } = process.env;
//   let smartAccount: SmartAccount;
//   const aUserOperationHash = "0xa3";
//   const aTxHash = "0xb4";
//   const aCreationClient = () => {
//     return Promise.resolve({
//       getAddress: () => smartAccountAddress,
//       sendUserOperation: () => Promise.resolve({ hash: aUserOperationHash }),
//       waitForUserOperationTransaction: () => Promise.resolve(aTxHash),
//     });
//   };
//   const aCreationAccount = () => { return Promise.resolve({}); };
//   const userOperation = new UserOperation(
//     new TransferTransaction(
//       new DefaultToken(rawUSDCData),
//       rawBeneficiaryData.address,
//       BigInt(1e18)
//     )
//   );
//
//   beforeEach(() => {
//     smartAccount = new AlchemySmartAccount(
//       new GeneratedPrivateKey(()=> TEST_PRIVATE_KEY as Hex),
//       new AlchemyConfig(),
//       aCreationClient,
//       aCreationClient,
//       aCreationAccount,
//     );
//   });
//
//   test("new", async () => {
//     expect(smartAccount).toBeTruthy();
//   });
//
//   test("owner address", async () => {
//     expect(await smartAccount.ownerAddress()).toEqual(TEST_OWNER_ADDRESS);
//   });
//
//   test("owner private key", async () => {
//     expect(await smartAccount.ownerPrivateKey()).toEqual(TEST_PRIVATE_KEY);
//   });
//
//   test("address", async () => {
//     expect(await smartAccount.address()).toEqual(smartAccountAddress);
//   });
//
//   test("send user operation", async () => {
//     expect(await smartAccount.send([userOperation])).toEqual(
//       aUserOperationHash
//     );
//   });
//
//   test("transaction hash of", async () => {
//     expect(await smartAccount.transactionHashOf(aUserOperationHash)).toEqual(
//       aTxHash
//     );
//   });
// });
