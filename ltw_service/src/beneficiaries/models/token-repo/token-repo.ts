import { RawToken } from "../../../constants/tokens/raw-token.type";

export class TokenRepo {
  constructor(private _rawData: RawToken[]) {}

  all(): RawToken[] {
    return this._rawData;
  }

  oneBy(symbol: string): RawToken | undefined {
    return this._rawData.find((token) => token.symbol === symbol);
  }
}
