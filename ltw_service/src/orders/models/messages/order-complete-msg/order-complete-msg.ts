import { Token } from '../../../../beneficiaries/models/token/token.interface';
import { SmsMsg } from '../../../../shared/messages/sms-msg.interface';
import { TranslatedKey } from '../../../../system/multi-language/translated-key/translated-key';
import { AmountOf } from '../../../../beneficiaries/models/amount-of/amount-of';

export class OrderCompleteMsg implements SmsMsg {
  constructor(
    private _anAmountOf: AmountOf,
    private _aToken: Token,
  ) { }

  public toString(): string {
    return new TranslatedKey('completeOrderMsg', {
      aBalanceAmount: this._anAmountOf.value().toFixed(2),
      aToken: this._aToken.symbol(),
    }).toString();
  }
}
