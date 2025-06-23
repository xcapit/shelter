import { Token } from '../token.interface';

export class NullToken implements Token {
  private _errorMsg = 'Token not found';

  symbol(): string {
    throw new Error(this._errorMsg);
  }
  decimals(): number {
    throw new Error(this._errorMsg);
  }
  address(): string {
    return '';
  }
}
