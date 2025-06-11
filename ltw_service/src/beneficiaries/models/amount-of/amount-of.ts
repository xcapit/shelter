import { Token } from "../token/token.interface";

export class AmountOf {
  constructor(
    private _aWeiAmount: bigint,
    private _aToken: Token
  ) { }

  value(): number {
    return parseFloat(this._formatUnits());
  }

  weiValue(): bigint {
    return this._aWeiAmount;
  }

  private _formatUnits(): string {
    const valueStr = BigInt(this._aWeiAmount).toString().padStart(this._aToken.decimals() + 1, "0");
    const whole = valueStr.slice(0, -this._aToken.decimals());
    const fraction = valueStr.slice(-this._aToken.decimals()).replace(/0+$/, "");
    return fraction ? `${whole}.${fraction}` : whole;
  }
}
