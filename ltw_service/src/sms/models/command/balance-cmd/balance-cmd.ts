import { Beneficiaries } from '../../../../beneficiaries/models/beneficiaries/beneficiaries';
import { BalanceOf } from '../../../../shared/balance-of/balance-of';
import { Tokens } from '../../../../beneficiaries/models/tokens/tokens';
import { AmountOf } from '../../../../beneficiaries/models/amount-of/amount-of';
import { Command } from '../command.interface';
import { TranslatedKey } from '../../../../system/multi-language/translated-key/translated-key';
import { DeployedShelter } from '@xcapit/shelter-sdk';


export class BalanceCmd implements Command {
  private _balanceAmount: AmountOf;

  constructor(
    private _params: string[],
    private _aPhoneNumber: string,
    private _beneficiaries: Beneficiaries,
    private _shelter: DeployedShelter,
  ) { }

  destinationNumber(): string {
    return this._aPhoneNumber;
  }

  private async _execute(): Promise<void> {
    this._balanceAmount = await new BalanceOf(
      await new Tokens().oneBy(this._params[0]),
      (await this._beneficiaries.findOneBy(this.destinationNumber())).keypair(),
      this._shelter,
    ).toAmount();
  }

  async bodyResponse(): Promise<string> {
    let result = new TranslatedKey('balanceError').toString();
    try {
      await this._execute();
      result = `${new TranslatedKey('balanceResponse')} ${this._balanceAmount.value()} ${this._params[0]}`;
    } catch (error: any) {
      console.log('Balance Command Error: ', error);
    }
    return result;
  }
}
