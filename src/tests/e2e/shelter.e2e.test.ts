import { Keypair, Networks } from "@stellar/stellar-sdk";
import { Shelter } from "../../shelter/shelter";
import { DefaultRpc } from "../../rpc/default/default-rpc";
import { walletSdk } from "@stellar/typescript-wallet-sdk";

describe("Shelter", () => {
  const _randomKeyPair = async (): Promise<Keypair> => {
    const stellar = walletSdk.Wallet.TestNet().stellar();
    const account = stellar.account().createKeypair();
    await stellar.fundTestnetAccount(account.publicKey);
    return Keypair.fromSecret(account.secretKey);
  };

  test("shelter deploy", async () => {
    // const steward = await _randomKeyPair();
    const stewardSecret =
      "SB2SQ4BGHIHHB637KBET2Y7XG3GN5FU4DZGXSSSB5ESFAR5H3XMI5GRI";
    const steward = Keypair.fromSecret(stewardSecret);
    const rpc = new DefaultRpc(
      "https://soroban-rpc.testnet.stellar.gateway.fm"
    );
    const shelter = new Shelter(
      steward,
      rpc,
      "50d8a2d89cb783d34c5400a4548b0335f97c3be58aac7ea3b0f8c4b60b001f4a",
      Networks.TESTNET
    );

    expect(await (await shelter.deploy()).stewardId()).toEqual(
      steward.publicKey()
    );
  });
});
