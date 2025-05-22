import { Keypair, Networks } from "@stellar/stellar-sdk";
import { Shelter } from "../../shelter/shelter";
import { DefaultRpc } from "../../rpc/default/default-rpc";
import { walletSdk } from "@stellar/typescript-wallet-sdk";

describe("Shelter", async () => {
  const rpc = new DefaultRpc(
    "https://soroban-rpc.testnet.stellar.gateway.fm"
  );
  const wasmHash = "50d8a2d89cb783d34c5400a4548b0335f97c3be58aac7ea3b0f8c4b60b001f4a";
  const _randomKeyPair = async (): Promise<Keypair> => {
    const stellar = walletSdk.Wallet.TestNet().stellar();
    const account = stellar.account().createKeypair();
    await stellar.fundTestnetAccount(account.publicKey);
    return Keypair.fromSecret(account.secretKey);
  };
  const steward = await _randomKeyPair();
  const shelter = new Shelter(
    steward,
    rpc,
    wasmHash,
    Networks.TESTNET
  );

  test("shelter deploy", async () => {
    expect(await (await shelter.deploy()).stewardId()).toEqual(
      steward.publicKey()
    );
  });

  test("bound aid", async () => {
    const deployedShelter = await shelter.deploy();

    expect(await deployedShelter.boundAid(recipient, token, amount, expiration)).toEqual(
      steward.publicKey()
    );
  });
});
