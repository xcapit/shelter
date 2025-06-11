import { RawToken } from "../../../../constants/tokens/raw-token.type";
import { Token } from "../token.interface";

export class DefaultToken implements Token {
  constructor(private _rawData: RawToken) { }

  symbol(): string {
    return this._rawData.symbol;
  }

  decimals(): number {
    return this._rawData.decimals;
  }

  address(): string {
    return this._rawData.contract;
  }
}
