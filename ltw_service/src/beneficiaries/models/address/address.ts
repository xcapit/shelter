import { StrKey } from "@stellar/stellar-sdk";

export class Address {

  constructor(
    private _anAddressValue: string,
  ) { }

  toString(): string {
    this._validate();
    return this._anAddressValue;
  }

  private _validate() {
    if (
      !StrKey.isValidEd25519PublicKey(this._anAddressValue) &&
      !StrKey.isValidContract(this._anAddressValue) &&
      !StrKey.isValidMed25519PublicKey(this._anAddressValue)
    ) throw new Error('Invalid Stellar Address');
  }
}
