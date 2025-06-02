import { walletSdk } from '@stellar/typescript-wallet-sdk';
import { object, string } from 'yup';

export class StellarNetwork {
  private _rules = object({
    isProduction: string().required().oneOf(['0', '1']),
  });

  constructor(
    private readonly _isProduction: string,
    private readonly _walletSdk = walletSdk.Wallet,
  ) {
    this._rules.validateSync({ isProduction: _isProduction });
  }

  value() {
    return this._isProduction === '0'
      ? this._walletSdk.TestNet().stellar()
      : this._walletSdk.MainNet().stellar();
  }
}
