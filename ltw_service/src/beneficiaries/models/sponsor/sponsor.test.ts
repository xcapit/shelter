import { Stellar } from '@stellar/typescript-wallet-sdk';
import { SigningKeypair } from '../../../shared/account-keypair/account-keypair';
import { Sponsor } from './sponsor';
import { FakeStellar } from '../fake-stellar/fake-stellar';
import { Keypair } from '@stellar/stellar-sdk';

describe('Sponsor', () => {
  const secretKey = 'SAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSU2';

  test('new', () => {
    expect(
      new Sponsor(SigningKeypair.fromSecret(Keypair.random().secret())),
    ).toBeTruthy();
  });

  test('from', () => {
    expect(Sponsor.from(secretKey)).toBeTruthy();
  });

  test('from failed on invalid value', () => {
    expect(() => Sponsor.from('')).toThrow();
  });

  test('createAccount', async () => {
    expect(await new Sponsor(
      SigningKeypair.fromSecret(Keypair.random().secret()),
      new FakeStellar(true) as unknown as Stellar
    ).createAccount()).toBeTruthy();
  });

  test('createAccount failed creation', async () => {
    await expect(
      new Sponsor(
        SigningKeypair.fromSecret(Keypair.random().secret()),
        new FakeStellar(false) as unknown as Stellar,
      ).createAccount(),
    ).rejects.toThrow();
  });
});
