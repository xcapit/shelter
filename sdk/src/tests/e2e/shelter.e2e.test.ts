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
    "50d8a2d89cb783d34c5400a4548b0335f97c3be58aac7ea3b0f8c4b60b001f4a";
  const tokenContractId =
    "CBN2MBW4AFEHXMLE5ADTAWFOQKEHBYTVO62AZ7DTQONACYE26VFPHKVA";
  const expiration = BigInt(Math.floor(Date.now() / 1000) + 7200);
  const amount = BigInt(1);
  const amountToFund = BigInt(1000);
  const tokenOwnerSecret =
    "SACQ5FHZMXD67HMT43HIYDSYQN7R3J7SXGOSBQ53EJ3WMH5DVHVRIPWC";
  const tokenOwnerKeypair = Keypair.fromSecret(tokenOwnerSecret);
  const recipientKeypair = Keypair.fromSecret(
    "SAG4OTVSVXNJH3BY2CMQSG25W2X7UGJWUYGELVHC3KEKXDZWSZRZEZDR"
  );
  const merch = "GDJ3AUXRFGZCPQVDSP67XZFFOXK4I36LDYEC4GRGFADDXKO6AFHQEJK7";
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
