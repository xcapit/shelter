// TODO:
// import { Hex } from "viem";
// import { generatePrivateKey } from "viem/accounts";
// import { PrivateKey } from "../private-key.interface";
//
// export class GeneratedPrivateKey implements PrivateKey {
//   private _cachedPrivateKey: Hex;
//   constructor(
//     private _privateKeyGenerator: CallableFunction = generatePrivateKey
//   ) {}
//
//   async value(): Promise<Hex> {
//     if (!this._cachedPrivateKey) {
//       this._cachedPrivateKey = this._privateKeyGenerator();
//     }
//     return this._cachedPrivateKey;
//   }
// }
