// TODO:
// import {AlchemyConfig} from '../alchemy-config/alchemy-config';
// import dotenv from 'dotenv';
// import process from 'process';
// import {deepHexlify, resolveProperties} from '@aa-sdk/core';
// import {alchemy} from '@account-kit/infra';
// import {Blockchain} from '../blockchain/blockchain';
// import axios from 'axios';

// dotenv.config();

// export class Paymaster {
//   constructor(
//     private _aConfig: AlchemyConfig,
//     private _aSmartAccount: any,
//     private _aCreationClient: CallableFunction,
//     private _aCreationAlchemyClient: CallableFunction,
//     private _env: any = process.env,
//     private _httpClient: any = axios,
//   ) {
//   }

//   config() {
//     return this._thirdPartyPaymasterConfigured()
//       ? {
//         dummyPaymasterAndData: async (userop: any) => {
//           return {
//             ...userop,
//             paymasterAndData: this._thirdPartyPaymasterAddress(),
//           };
//         },
//         paymasterAndData: async (userop: any, opts: any) => {
//           return {
//             ...userop,
//             paymasterAndData: await this._httpClient.post(
//               this._thirdPartyPaymasterUrl(),
//               {
//                 userop: deepHexlify(await resolveProperties(userop)),
//                 entryPoint: opts.account.getEntryPoint().address,
//               },
//             ).data,
//           };
//         },
//       }
//       : {policyId: this._aConfig.policyId()};
//   }

//   client() {
//     const client = this._thirdPartyPaymasterConfigured() ?
//       this._aCreationClient :
//       this._aCreationAlchemyClient;

//     return client({
//       transport: alchemy({apiKey: this._aConfig.apiKey()}),
//       chain: new Blockchain().value(),
//       account: this._aSmartAccount,
//       ...this.config(),
//     });
//   }

//   private _thirdPartyPaymasterConfigured() {
//     return (
//       this._thirdPartyPaymasterUrl() &&
//       this._thirdPartyPaymasterName() &&
//       this._thirdPartyPaymasterAddress()
//     );
//   }

//   private _thirdPartyPaymasterAddress() {
//     return this._env.THIRD_PARTY_PAYMASTER_ADDRESS;
//   }

//   private _thirdPartyPaymasterName() {
//     return this._env.THIRD_PARTY_PAYMASTER_NAME;
//   }

//   private _thirdPartyPaymasterUrl() {
//     return this._env.THIRD_PARTY_PAYMASTER_URL;
//   }
// }
