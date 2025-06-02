// TODO
// import {privateKeyToAccount} from 'viem/accounts';
// import {Hex} from 'viem';
// import {SmartAccount} from '../smart-account';
// import {AlchemyConfig} from '../../alchemy-config/alchemy-config';
// import {Blockchain} from '../../blockchain/blockchain';
// import {UserOperation} from '../../user-operation/user-operation';
// import {PrivateKey} from '../../private-key/private-key.interface';
// import {createLightAccount} from '@account-kit/smart-contracts';
// import {
//   BatchUserOperationCallData,
//   LocalAccountSigner,
// } from '@aa-sdk/core';
// import {createSmartAccountClient} from "@aa-sdk/core";
// import {Paymaster} from "../../paymaster/paymaster";
// import {alchemy, createAlchemySmartAccountClient} from "@account-kit/infra";

// export class AlchemySmartAccount implements SmartAccount {
//   private _cachedAccountClient: any;

//   constructor(
//     private _aPrivateKey: PrivateKey,
//     private _aConfig: AlchemyConfig = new AlchemyConfig(),
//     private _aCreationClient: CallableFunction = createSmartAccountClient,
//     private _aCreationAlchemyClient: CallableFunction = createAlchemySmartAccountClient,
//     private _aCreationAccount: CallableFunction = createLightAccount,
//   ) {
//   }

//   async send(userOperations: UserOperation[]): Promise<string> {
//     return (
//       await (
//         await this._accountClient()
//       ).sendUserOperation({
//         uo: userOperations.map((uo) =>
//           uo.toJSON(),
//         ) as BatchUserOperationCallData,
//       })
//     ).hash;
//   }

//   async transactionHashOf(aUserOperationHash: string): Promise<Hex> {
//     return await (
//       await this._accountClient()
//     ).waitForUserOperationTransaction({
//       hash: aUserOperationHash,
//     });
//   }

//   async ownerPrivateKey(): Promise<Hex> {
//     return await this._aPrivateKey.value();
//   }

//   async ownerAddress(): Promise<string> {
//     return privateKeyToAccount(await this.ownerPrivateKey()).address;
//   }

//   async address(): Promise<string> {
//     return (await this._accountClient()).getAddress();
//   }

//   private _transportAndChain() {
//     return {
//       transport: alchemy({apiKey: this._aConfig.apiKey()}),
//       chain: new Blockchain().value()
//     };
//   }

//   private async _accountClient() {
//     if (!this._cachedAccountClient) {
//       this._cachedAccountClient = new Paymaster(
//         this._aConfig,
//         await this._aCreationAccount({
//           ...this._transportAndChain(),
//           signer: LocalAccountSigner.privateKeyToAccountSigner(
//             await this.ownerPrivateKey(),
//           ),
//         }),
//         this._aCreationClient,
//         this._aCreationAlchemyClient
//       ).client();
//     }
//     return this._cachedAccountClient;
//   }
// }
