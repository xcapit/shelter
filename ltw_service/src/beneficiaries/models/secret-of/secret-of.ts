// TODO:
// import { Hex } from "viem";
import { Beneficiaries } from "../beneficiaries/beneficiaries";

export class SecretOf {
  constructor(
    private _phoneNumber: string,
    private _beneficiaries: Beneficiaries = new Beneficiaries()
  ) {}

//   async value(): Promise<Hex> {
//     return (await this._beneficiaries.findPrivateKeyBy(
//       this._phoneNumber
//     )) as Hex;
//   }
}
