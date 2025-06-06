import { Keypair } from '@stellar/stellar-sdk';
import { SponsoredAccount } from './sponsored-account';

describe('Sponsored Account', () => {
  test('new', () => {
    expect(new SponsoredAccount(Keypair.random())).toBeTruthy();
  });

  test('address', async () => {
    expect(await new SponsoredAccount(Keypair.random()).address()).toMatch(/^G[A-Z2-7]{55}$/);
  });
});
