import { Keypair, Networks } from "@stellar/stellar-sdk";
import { Shelter } from "../../shelter/shelter";
import { DefaultRpc } from "../../rpc/default/default-rpc";

describe('e2e', () => {
  test('aoeu', () => {
    const steward = Keypair.random();
    const rpc = new DefaultRpc('https://soroban-rpc.testnet.stellar.gateway.fm');
    const shelter = new Shelter(
      steward,
      rpc,
      '',
      Networks.TESTNET
    )
    expect(true).toBeTruthy();
  });
});
