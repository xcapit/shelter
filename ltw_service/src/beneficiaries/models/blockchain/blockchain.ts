// TODO:
// import dotenv from "dotenv";
// import process from "process";
// import { Chain } from "viem";
// import {polygon, polygonAmoy} from "@account-kit/infra";

// dotenv.config();

// const { CURRENT_BLOCKCHAIN } = process.env;
// export class Blockchain {
//   constructor(private _currentBlockchain: string = CURRENT_BLOCKCHAIN!) {}

//   value(): Chain {
//     return this._blockchains().get(this._currentBlockchain)!;
//   }

//   private _blockchains(): Map<string, Chain> {
//     return new Map<string, Chain>([
//       ["polygon", polygon],
//       ["amoy", polygonAmoy],
//     ]);
//   }
// }
