import { Shelter } from '@xcapit/shelter-sdk';
import { AmountOf } from '../../beneficiaries/models/amount-of/amount-of';
import { Token } from '../../beneficiaries/models/token/token.interface';
import { Keypair } from '@stellar/stellar-sdk';

export class BalanceOf {
  constructor(
    private _aToken: Token,
    private _recipient: Keypair,
    private _shelter: Shelter,
  ) { }

  async toAmount(): Promise<AmountOf> {
    return new AmountOf(
      await this._shelter.aidOf(
        this._recipient.rawPublicKey(),
        this._aToken.address(),
      ),
      this._aToken,
    );
  }

  async toJson() {
    return {
      balance: (await this.toAmount()).value(),
      token: this._aToken.symbol(),
    };
  }
}
