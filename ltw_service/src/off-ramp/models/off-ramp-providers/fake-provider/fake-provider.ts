import { Beneficiary } from "../../../../beneficiaries/models/beneficiary/beneficiary.interface";
import { SmartAccount } from "../../../../beneficiaries/models/smart-account/smart-account";
import { Token } from "../../../../beneficiaries/models/token/token.interface";
import { rawOffRampResponse } from "../../../../fixtures/raw-off-ramp-response-data";
import { Provider } from "../provider.interface";
import { OffRampResponse } from "../providers-response.interface";

export class FakeProvider implements Provider{
  constructor(
    private _amount: number,
    private _token: Token,
    private _currency: string,
    private _beneficiary: Beneficiary,
    private _smartAccount: SmartAccount,
  ) {}

  amount(): number {
    return this._amount;
  }

  token(): Token {
    return this._token;
  }

  currency(): string {
    return this._currency;
  }

  beneficiary(): Beneficiary {
    return this._beneficiary;
  }

  execute(): Promise<OffRampResponse> {
    return Promise.resolve(rawOffRampResponse);
  }
}
