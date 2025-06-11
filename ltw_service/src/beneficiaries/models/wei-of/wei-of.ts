import { Token } from "../token/token.interface";

export class WeiOf {
  constructor(
    private _anAmount: number | string,
    private _aToken: Token
  ) { }

  value(): bigint {
    return this._parseUnits();
  }

  private _parseUnits(): bigint {
    const [whole, fraction = ""] = `${this._anAmount}`.split(".");
    const paddedFraction = (fraction + "0".repeat(this._aToken.decimals())).slice(0, this._aToken.decimals());
    return BigInt(whole + paddedFraction);
  }
}
