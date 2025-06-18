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
    "CBN2MBW4AFEHXMLE5ADTAWFOQKEHBYTVO62AZ7DTQONACYE26VFPHKVA";
  const expiration = BigInt(Math.floor(Date.now() / 1000) + 7200);
  const amount = BigInt(1);
  const tokenOwnerSecret =
    "SACQ5FHZMXD67HMT43HIYDSYQN7R3J7SXGOSBQ53EJ3WMH5DVHVRIPWC";
  const tokenOwnerKeypair = Keypair.fromSecret(tokenOwnerSecret);
  const recipientKeypair = Keypair.fromSecret(
    "SAG4OTVSVXNJH3BY2CMQSG25W2X7UGJWUYGELVHC3KEKXDZWSZRZEZDR"
  );
  const merch = "GDJ3AUXRFGZCPQVDSP67XZFFOXK4I36LDYEC4GRGFADDXKO6AFHQEJK7";
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
    const sac = _sac(tokenOwnerKeypair.publicKey());
    const deployedShelter = await shelter.deploy();
    const mintTx = new Transaction(
      await sac.mint({
        to: deployedShelter.id(),
        amount: BigInt(1000),
      }),
      tokenOwnerKeypair,
      defaultRpc
    );
    const mintResultTx = await mintTx.result();
    expect(mintResultTx.status).toEqual(rpc.Api.GetTransactionStatus.SUCCESS);

    await expect(
      deployedShelter.boundAid(
        recipientKeypair.rawPublicKey(),
        tokenContractId,
        amount,
        expiration
      )
    ).resolves.toBeUndefined();
  });

  test("recipient transfer from shelter", async () => {
    const sac = _sac(tokenOwnerKeypair.publicKey());
    const deployedShelter = await shelter.deploy();
    const mintTx = new Transaction(
      await sac.mint({
        to: deployedShelter.id(),
        amount: BigInt(1000),
      }),
      tokenOwnerKeypair,
      defaultRpc
    );
    const mintResultTx = await mintTx.result();
    expect(mintResultTx.status).toEqual(rpc.Api.GetTransactionStatus.SUCCESS);
    await expect(
      deployedShelter.boundAid(
        recipientKeypair.rawPublicKey(),
        tokenContractId,
        amount,
        expiration
      )
    ).resolves.toBeUndefined();

    await expect(
      new Aid(
        recipientKeypair,
        _sac(recipientKeypair.publicKey()),
        defaultRpc
      ).transfer(
        deployedShelter,
        merch,
        amount,
        new DefaultPass(recipientKeypair, deployedShelter.id(), defaultRpc)
      )
    ).resolves.toBeUndefined();
  });

  test("recipient transfer from shelter (sponsored)", async () => {
    const sponsor = steward;
    const sac = _sac(tokenOwnerKeypair.publicKey());
    const deployedShelter = await shelter.deploy();
    const mintTx = new Transaction(
      await sac.mint({
        to: deployedShelter.id(),
        amount: BigInt(1000),
      }),
      tokenOwnerKeypair,
      defaultRpc
    );
    const mintResultTx = await mintTx.result();
    expect(mintResultTx.status).toEqual(rpc.Api.GetTransactionStatus.SUCCESS);
    await expect(
      deployedShelter.boundAid(
        recipientKeypair.rawPublicKey(),
        tokenContractId,
        amount,
        expiration
      )
    ).resolves.toBeUndefined();

    await expect(
      new Aid(
        sponsor,
        _sac(sponsor.publicKey()),
        defaultRpc
      ).transfer(
        deployedShelter,
        merch,
        amount,
        new DefaultPass(recipientKeypair, deployedShelter.id(), defaultRpc)
      )
    ).resolves.toBeUndefined();
  });
});
