import { Keypair, Networks, rpc } from "@stellar/stellar-sdk";
import { Shelter } from "../../shelter/shelter";
import { DefaultRpc } from "../../rpc/default/default-rpc";
import { walletSdk } from "@stellar/typescript-wallet-sdk";
import { Client as SAC } from "sac-sdk";

describe("Shelter", () => {
  const defaultRpc = new DefaultRpc(
    "https://soroban-rpc.testnet.stellar.gateway.fm"
  );
  const wasmHash =
    "50d8a2d89cb783d34c5400a4548b0335f97c3be58aac7ea3b0f8c4b60b001f4a";
  const _randomKeyPair = async (): Promise<Keypair> => {
    const stellar = walletSdk.Wallet.TestNet().stellar();
    const account = stellar.account().createKeypair();
    await stellar.fundTestnetAccount(account.publicKey);
    return Keypair.fromSecret(account.secretKey);
  };
  let steward: Keypair;
  let shelter: Shelter;

  beforeEach(async () => {
    steward = await _randomKeyPair();
    shelter = new Shelter(steward, defaultRpc, wasmHash, Networks.TESTNET);
  });

  test("shelter deploy", async () => {
    expect(await (await shelter.deploy()).stewardId()).toEqual(
      steward.publicKey()
    );
  });

  test("bound aid", async () => {
    const recipient = Keypair.fromPublicKey(
      "GASL6XDOK2TO6SCFTXFN2HQDAONLBID2GKX5TYBTHOWA7ZU7VRFZNHGM"
    );
    const tokenContractId =
      "CCQK3OJ5T4A5B4SDKQWH7PQKC5HMUZHIGUWF2INTKDQB32F3YPEW7L27";
    const expiration = BigInt(Math.floor(Date.now() / 1000) + 7200);
    const amount = BigInt(1);
    const aliceSecret =
      "SDZVEQPNLS74A5E7VDSUHV2EDUJJUBNNT46PRNGAJXM4SZCBGIYGAZEX";
    const aliceKeyPair = Keypair.fromSecret(aliceSecret);

    const _sac = new SAC({
      contractId: tokenContractId,
      networkPassphrase: Networks.TESTNET,
      rpcUrl: defaultRpc.url(),
      publicKey: aliceKeyPair.publicKey(),
    });

    const deployedShelter = await shelter.deploy();

    const rawMintTx = await _sac.mint({
      to: deployedShelter.id(),
      amount: BigInt(1000),
    });
    const builtMintTx = rawMintTx.built!;
    builtMintTx.sign(aliceKeyPair);

    const sentMintTx = await defaultRpc.server().sendTransaction(builtMintTx);
    const mintTx = await defaultRpc.server().pollTransaction(sentMintTx.hash);

    expect(mintTx.status).toEqual(rpc.Api.GetTransactionStatus.SUCCESS);

    await expect(
      deployedShelter.boundAid(
        recipient.rawPublicKey(),
        tokenContractId,
        amount,
        expiration
      )
    ).resolves.toBeUndefined();
  });
});
