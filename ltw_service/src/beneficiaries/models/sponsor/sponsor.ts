import { SponsoringBuilder } from '@stellar/typescript-wallet-sdk';
import { SigningKeypair } from '../../../shared/account-keypair/account-keypair';
import { SponsoredAccount } from '../sponsored-account/sponsored-account';
import { StellarNetwork } from '../stellar-network/stellar-network';
import { env } from 'process';
import dotenv from 'dotenv';

dotenv.config();

export class Sponsor {
  constructor(
    private readonly _signingKeypair: SigningKeypair | any,
    private readonly _stellar = new StellarNetwork(env.PRODUCTION!).value(),
  ) { }

  static from(aSecretKey: string): Sponsor {
    return new this(SigningKeypair.fromSecret(aSecretKey));
  }

  async createAccount() {
    const sponsoredKeypair: any = this._stellar.account().createKeypair();

    this._validate(
      await this._stellar.submitTransaction(
        sponsoredKeypair.sign(
          this._signingKeypair.sign(
            await this._accountCreationTx(sponsoredKeypair)
          ),
        ),
      ),
    );

    return new SponsoredAccount(sponsoredKeypair.keypair);
  }

  private async _accountCreationTx(sponsoredKeypair: SigningKeypair): Promise<any> {
    return (
      await this._stellar.transaction({
        sourceAddress: this._signingKeypair,
      })
    )
      .sponsoring(
        this._signingKeypair,
        (bldr: SponsoringBuilder) => bldr.createAccount(sponsoredKeypair),
        sponsoredKeypair,
      )
      .build();
  }

  private _validate(txResult: boolean) {
    if (!txResult) {
      throw new Error('Sponsored Account Creation Failed');
    }
  }
}
