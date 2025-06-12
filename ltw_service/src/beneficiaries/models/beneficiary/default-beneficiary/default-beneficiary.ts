import { Keypair } from '@stellar/stellar-sdk';
import { Beneficiary } from '../beneficiary.interface';
import { RawBeneficiary } from '../raw-beneficiary.type';

export class DefaultBeneficiary implements Beneficiary {
  constructor(private _rawBeneficiaryData: RawBeneficiary) { }

  keypair(): Keypair {
    return Keypair.fromSecret(this._rawBeneficiaryData.secret);
  }

  phoneNumber(): string {
    return this._rawBeneficiaryData.phoneNumber;
  }

  address(): string {
    return this._rawBeneficiaryData.address;
  }

  countryCode(): string | undefined {
    return this._rawBeneficiaryData.countryCode;
  }

  networkProvider(): string | undefined {
    return this._rawBeneficiaryData.networkProvider;
  }
}
