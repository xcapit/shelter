// TODO:
// import { AlchemySmartAccount } from "../../beneficiaries/models/smart-account/alchemy-smart-account/alchemy-smart-account";
// import dotenv from "dotenv";
// import process from "process";
// import { Hex } from "viem";
// import { AlchemyConfig } from "../../beneficiaries/models/alchemy-config/alchemy-config";
// import { GeneratedPrivateKey } from "../../beneficiaries/models/private-key/generated-private-key/generated-private-key";
//
// dotenv.config();
//
// describe("SmartAccount", () => {
//   const { TEST_PRIVATE_KEY, TEST_SMART_ACCOUNT_ADDRESS } = process.env;
//
//   let smartAccount: AlchemySmartAccount;
//
//   beforeEach(() => {
//     smartAccount = new AlchemySmartAccount(
//       new GeneratedPrivateKey(() => Promise.resolve(TEST_PRIVATE_KEY! as Hex)),
//       new AlchemyConfig()
//     );
//   });
//
//   test("address", async () => {
//     expect(await smartAccount.address()).toEqual(TEST_SMART_ACCOUNT_ADDRESS!);
//   });
// });
