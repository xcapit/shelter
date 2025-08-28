import { Asset, Keypair, Networks, Operation, rpc, TransactionBuilder } from "@stellar/stellar-sdk";
import { DefaultPass } from "../../pass/default/default-pass";
import { Transaction } from "../../transaction/transaction";
import { walletSdk } from "@stellar/typescript-wallet-sdk";
import { Foundry } from "../../foundry/foundry";
import { Client as SAC } from "sac-sdk";
import { Rpc } from "../../rpc/rpc";
import { Aid } from "../../aid/aid";
import type { Shelter } from "../../shelter/shelter";

describe("Shelter", () => {
  const defaultRpc = new Rpc(
    new rpc.Server("https://soroban-rpc.testnet.stellar.gateway.fm")
  );
  const wasmHash =
    "0cb9fd56dc35f16f1ffb1f7d82b9e5dd00696c01db48bf8cfcb0fb9c6054bd7a";
  const tokenContractId =
    "CBZOEAU4OS7IC3QANZ4KKSMITOJB5U6Z5PUMZBN6VL5IFVDY63KXRKG3";
  const expiration = BigInt(Math.floor(Date.now() / 1000) + 7200);
  const amount = BigInt(1);
  const amountToFund = BigInt(1000);
  const tokenOwnerSecret =
    "SDFA4RDR443J62KUZMMT5MPNJSFTRPD4EIJY5P6KQ2Q5QOJ6U6P5HUVD";
  const tokenOwnerKeypair = Keypair.fromSecret(tokenOwnerSecret);
  const recipientKeypair = Keypair.fromSecret(
    "SAYRFDQ2RG4C4RPJMDPNHPM7M6P5JZNMSRWHSCTHKIJV2FIBMNW52CZN"
  );
  const merch = "GDPHJX5IDMYPKCOUGTLA56GGAJWEVGIOO55ATXRUFUSLJTOM4U3TS2NS";
  const asset = new Asset(
    'BO1',
    tokenOwnerKeypair.publicKey()
  );
  let steward: Keypair;
  let foundry: Foundry;
  let shelter: Shelter;
  let sac: SAC;

  const _stellar = () => walletSdk.Wallet.TestNet().stellar();

  const _randomKeyPair = async (): Promise<Keypair> => {
    const stellar = _stellar();
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

  const _fund = async (aShelter: Shelter, sac: SAC) => {
    const mintTx = new Transaction(
      await sac.mint({
        to: aShelter.id(),
        amount: amountToFund,
      }),
      tokenOwnerKeypair,
      defaultRpc
    );
    return await mintTx.result();
  };

  beforeEach(async () => {
    steward = await _randomKeyPair();
    foundry = new Foundry(steward, defaultRpc, wasmHash);
    shelter = await foundry.newShelter();
  });

  test("shelter deploy", async () => {
    expect(await (await foundry.newShelter()).stewardId()).toEqual(
      steward.publicKey()
    );
  });

  test("gate manipulation", async () => {
    await expect(shelter.gate().guard()).resolves.toBeUndefined();
    await expect(shelter.gate().open()).resolves.toBeUndefined();
    await expect(shelter.gate().seal()).resolves.toBeUndefined();
    await expect(shelter.gate().open()).rejects.toThrow();
    await expect(shelter.gate().guard()).rejects.toThrow();
  });

  test("update steward", async () => {
    const newSteward = Keypair.random();

    await expect(shelter.updateSteward(newSteward)).resolves.toBeUndefined();
    expect(await shelter.stewardId()).toEqual(newSteward.publicKey());
  });

  describe("With funds", () => {
    beforeEach(async () => {
      sac = _sac(tokenOwnerKeypair.publicKey());
      await _fund(shelter, sac);
    });

    test("bound aid", async () => {
      const aid = new Aid(
        recipientKeypair,
        recipientKeypair,
        _sac(recipientKeypair.publicKey()),
        shelter,
        defaultRpc
      );

      expect((await _fund(
        shelter, _sac(tokenOwnerKeypair.publicKey())
      )).status).toEqual(rpc.Api.GetTransactionStatus.SUCCESS);
      await expect(aid.bound(amount, expiration)).resolves.toBeUndefined();
    });

    test("unbound aid", async () => {
      const aid = new Aid(
        recipientKeypair,
        recipientKeypair,
        _sac(recipientKeypair.publicKey()),
        shelter,
        defaultRpc
      );

      await aid.bound(amount, expiration);

      await expect(aid.unbound()).resolves.toBeUndefined();
      await expect(shelter.aidOf(
        recipientKeypair.rawPublicKey(), sac.options.contractId)
      ).resolves.toEqual(BigInt(0));
    });

    test("steward withdraw", async () => {
      await shelter.updateReleaseKey(steward.rawPublicKey());
      await shelter.gate().seal();
      const account = await _stellar().server.loadAccount(steward.publicKey());
      let transaction = new TransactionBuilder(account, {
        networkPassphrase: Networks.TESTNET,
        fee: '100000',
      }).addOperation(
        Operation.changeTrust({
          asset: asset,
        })
      ).setTimeout(180).build();
      transaction.sign(steward);
      await _stellar().server.submitTransaction(transaction as any);

      expect((await sac.balance({ id: shelter.id() })).result).toEqual(amountToFund);
      expect((await sac.balance({ id: steward.publicKey() })).result).toEqual(BigInt(0));
      await expect(
        shelter.withdraw(
          _sac(steward.publicKey()),
          new DefaultPass(steward, shelter.id(), defaultRpc)
        )
      ).resolves.toBeUndefined();
      expect((await sac.balance({ id: shelter.id() })).result).toEqual(BigInt(0));
      expect((await sac.balance({ id: steward.publicKey() })).result).toEqual(amountToFund);
    });

    test("recipient transfer from shelter", async () => {
      const aid = new Aid(
        recipientKeypair,
        recipientKeypair,
        _sac(recipientKeypair.publicKey()),
        shelter,
        defaultRpc
      );

      await expect(aid.bound(amount, expiration)).resolves.toBeUndefined();
      await expect(
        aid.transfer(
          merch,
          amount,
          new DefaultPass(recipientKeypair, shelter.id(), defaultRpc)
        )
      ).resolves.toBeUndefined();
    });

    test("recipient transfer from shelter (sponsored)", async () => {
      const aid = new Aid(
        recipientKeypair,
        steward,
        _sac(steward.publicKey()),
        shelter,
        defaultRpc
      );

      await expect(aid.bound(amount, expiration)).resolves.toBeUndefined();
      await expect(
        aid.transfer(
          merch,
          amount,
          new DefaultPass(recipientKeypair, shelter.id(), defaultRpc)
        )
      ).resolves.toBeUndefined();
    });
  });
});
