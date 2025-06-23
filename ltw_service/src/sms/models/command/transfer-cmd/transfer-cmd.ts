import { Keypair } from '@stellar/stellar-sdk';
import { Beneficiaries } from '../../../../beneficiaries/models/beneficiaries/beneficiaries';
import { TranslatedKey } from '../../../../system/multi-language/translated-key/translated-key';
import { Command } from '../command.interface';
import { Aid, DeployedShelter, Pass, Rpc } from '@xcapit/shelter-sdk';
import { SecretOf } from '../../../../beneficiaries/models/secret-of/secret-of';
import { BalanceOf } from '../../../../shared/balance-of/balance-of';
import { Tokens } from '../../../../beneficiaries/models/tokens/tokens';
import { AmountOf } from '../../../../beneficiaries/models/amount-of/amount-of';
import { Token } from '../../../../beneficiaries/models/token/token.interface';
import { WeiOf } from '../../../../beneficiaries/models/wei-of/wei-of';

export class TransferCmd implements Command {
  constructor(
    private _phoneNumber: string,
    private _params: string[],
    private _beneficiaries: Beneficiaries,
    private _shelter: DeployedShelter,
    private _aid: Aid,
    private _rpc: Rpc,
  ) {}

  destinationNumber(): string {
    return this._phoneNumber;
  }

  private async _execute(): Promise<void> {
    await this._aid.transfer(
      this._shelter,
      this._params[2],
      new WeiOf(this._params[1], await this._token()).value(),
      new Pass(
        Keypair.fromSecret(
          await new SecretOf(this._phoneNumber, this._beneficiaries).value(),
        ),
        this._shelter.id(),
        this._rpc,
      ),
    );
  }

  async bodyResponse(): Promise<string> {
    let result = new TranslatedKey('transferError').toString();
    try {
      await this._execute();
      result = new TranslatedKey('transferResponse', {
        aBalanceAmount: (await this._balance()).value(),
        aToken: this._params[0],
      }).toString();
    } catch (error: any) {
      console.log('Transfer Command Error: ', error);
    }
    return result;
  }

  private async _balance(): Promise<AmountOf> {
    return await new BalanceOf(
      await this._token(),
      (await this._beneficiaries.findOneBy(this.destinationNumber())).keypair(),
      this._shelter,
    ).toAmount();
  }

  private async _token(): Promise<Token> {
    return await new Tokens().oneBy(this._params[0]);
  }
}
