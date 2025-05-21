import { Keypair, Networks } from "@stellar/stellar-sdk";
import { Shelter } from "../../shelter/shelter";
import { DefaultRpc } from "../../rpc/default/default-rpc";
import { walletSdk } from "@stellar/typescript-wallet-sdk";


describe('e2e', () => {

  const _randomKeyPair = async (): Promise<Keypair> => {
    const stellar = walletSdk.Wallet.TestNet().stellar();
    const account = stellar.account().createKeypair();
    await stellar.fundTestnetAccount(account.publicKey);
    return Keypair.fromSecret(account.secretKey);
  };

  
  test('aoeu', async () => {
    const steward = Keypair.random();
    const rpc = new DefaultRpc('https://soroban-rpc.testnet.stellar.gateway.fm');
    const shelter = new Shelter(
      steward,
      rpc,
      '50d8a2d89cb783d34c5400a4548b0335f97c3be58aac7ea3b0f8c4b60b001f4a',
      Networks.TESTNET
    )

    expect(await shelter.deploy()).toBeTruthy();
  });
});
