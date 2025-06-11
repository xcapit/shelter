import { rawTokenData } from '../../fixtures/raw-tokens-data';
import { recipient } from '../../fixtures/raw-wallet-data';
import { DefaultToken } from '../../beneficiaries/models/token/default-token/default-token';
import { BalanceOf } from './balance-of';
import { DeployedShelter, FakeClient, FakeServer, Rpc } from '@xcapit/shelter-sdk';
import { Keypair } from '@stellar/stellar-sdk';

describe('BalanceOf', () => {
  const aToken = new DefaultToken(rawTokenData);
  let balance: BalanceOf;
  const shelter = new DeployedShelter(
    Keypair.random(),
    new Rpc(new FakeServer()),
    new FakeClient({})
  );

  beforeEach(() => {
    balance = new BalanceOf(aToken, recipient, shelter);
  });

  test('new', () => {
    expect(balance).toBeTruthy();
  });

  test('toAmount', async () => {
    expect((await balance.toAmount()).value()).toEqual(1e-7);
  });

  test("toJson", async () => {
    expect((await balance.toJson()).token).toEqual(aToken.symbol());
    expect((await balance.toJson()).balance).toEqual(1e-7);
  });
});
