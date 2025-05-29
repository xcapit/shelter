import { Keypair, Networks, rpc } from "@stellar/stellar-sdk";
import { DefaultPass } from "../../pass/default/default-pass";
import { Transaction } from "../../transaction/transaction";
import { walletSdk } from "@stellar/typescript-wallet-sdk";
import { Shelter } from "../../shelter/shelter";
import { Client as SAC } from "sac-sdk";
import { Rpc } from "../../rpc/rpc";
import { Aid } from "../../aid/aid";

describe("Shelter", () => {
  const defaultRpc = new Rpc(
    new rpc.Server("https://soroban-rpc.testnet.stellar.gateway.fm")
  );
  const wasmHash =
    "50d8a2d89cb783d34c5400a4548b0335f97c3be58aac7ea3b0f8c4b60b001f4a";
  const tokenContractId =
    "CCQK3OJ5T4A5B4SDKQWH7PQKC5HMUZHIGUWF2INTKDQB32F3YPEW7L27";
  const expiration = BigInt(Math.floor(Date.now() / 1000) + 7200);
  const amount = BigInt(1);
  const aliceSecret =
    "SDZVEQPNLS74A5E7VDSUHV2EDUJJUBNNT46PRNGAJXM4SZCBGIYGAZEX";
  const aliceKeyPair = Keypair.fromSecret(aliceSecret);
  let steward: Keypair;
  let shelter: Shelter;

  const _randomKeyPair = async (): Promise<Keypair> => {
    const stellar = walletSdk.Wallet.TestNet().stellar();
    const account = stellar.account().createKeypair();
    await stellar.fundTestnetAccount(account.publicKey);
    return Keypair.fromSecret(account.secretKey);
  };

  const _sac = (publicKey: string) => {
    return new SAC({
      contractId: tokenContractId,
      networkPassphrase: Networks.TESTNET,
      rpcUrl: defaultRpc.url(),
      publicKey,
    });
  };

  beforeEach(async () => {
    steward = await _randomKeyPair();
    shelter = new Shelter(steward, defaultRpc, wasmHash);
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
    const sac = _sac(aliceKeyPair.publicKey());
    const deployedShelter = await shelter.deploy();
    const mintTx = new Transaction(
      await sac.mint({
        to: deployedShelter.id(),
        amount: BigInt(1000),
      }),
      aliceKeyPair,
      defaultRpc
    );
    const mintResultTx = await mintTx.result();
    expect(mintResultTx.status).toEqual(rpc.Api.GetTransactionStatus.SUCCESS);

    await expect(
      deployedShelter.boundAid(
        recipient.rawPublicKey(),
        tokenContractId,
        amount,
        expiration
      )
    ).resolves.toBeUndefined();
  });

  test("recipient transfer from shelter", async () => {
    const recipient = Keypair.fromSecret(
      "SBTD4FBLWCWVNJCOSOMVYXPJOYLTQW52EC3AUZ2Q3XX5PAO3SMXIKWHH"
    );
    const sac = _sac(aliceKeyPair.publicKey());
    const deployedShelter = await shelter.deploy();
    const mintTx = new Transaction(
      await sac.mint({
        to: deployedShelter.id(),
        amount: BigInt(1000),
      }),
      aliceKeyPair,
      defaultRpc
    );
    const mintResultTx = await mintTx.result();
    expect(mintResultTx.status).toEqual(rpc.Api.GetTransactionStatus.SUCCESS);
    await expect(
      deployedShelter.boundAid(
        recipient.rawPublicKey(),
        tokenContractId,
        amount,
        expiration
      )
    ).resolves.toBeUndefined();

    await expect(
      new Aid(recipient, _sac(recipient.publicKey()), defaultRpc).transfer(
        deployedShelter,
        "GAXRNW46AL4PI7Q6FABZ2OS3BKG3I7FHMBPRP7FBQHQLFX2KU2PBGGUP",
        amount,
        new DefaultPass(recipient, deployedShelter.id(), defaultRpc)
      )
    ).resolves.toBeUndefined();
  });
});
