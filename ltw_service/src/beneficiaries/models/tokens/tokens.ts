import { DefaultToken } from "../token/default-token/default-token";
import { TokenRepo } from "../token-repo/token-repo";
import { TokensData } from "../tokens-data/tokens-data";
import { Token } from "../token/token.interface";
import { NullToken } from "../token/null-token/null-token";

export class Tokens {
  constructor(
    private _dataRepo: TokenRepo = new TokenRepo(new TokensData().value())
  ) {}

  async value(): Promise<Token[]> {
    return this._dataRepo.all().map((item) => new DefaultToken(item));
  }

  async oneBy(aTokenSymbol: string): Promise<Token> {
    const rawToken = this._dataRepo.oneBy(aTokenSymbol);
    return rawToken ? new DefaultToken(rawToken) : new NullToken();
  }
}
