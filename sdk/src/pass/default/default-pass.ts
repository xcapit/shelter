import {
  Client,
  contract,
  hash,
  xdr,
  type Keypair,
} from "shelter-sdk";
import type { Pass } from "../pass.interface";
import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";
import type { Rpc } from "../../rpc/rpc";

export class DefaultPass implements Pass {
  constructor(
    private readonly _recipient: Keypair,
    private readonly _shelterId: string,
    private readonly _rpc: Rpc,
  ) { }

  async applyTo(tx: AssembledTransaction<null>): Promise<AssembledTransaction<null>> {
    await tx.signAuthEntries({
      address: this._shelterId,
      authorizeEntry: (entry: any) => {
        const clone = xdr.SorobanAuthorizationEntry.fromXDR(entry.toXDR());
        return this._signAuthEntry(clone);
      },
    });

    return tx;
  }

  async _signAuthEntry(entry: xdr.SorobanAuthorizationEntry) {
    const credentials = entry.credentials().address();

    let expiration = credentials.signatureExpirationLedger();

    if (!expiration) {
      const { sequence } = await this._rpc.server().getLatestLedger();
      expiration = sequence + contract.DEFAULT_TIMEOUT / 5;
    }
    credentials.signatureExpirationLedger(expiration);

    const preimage = xdr.HashIdPreimage.envelopeTypeSorobanAuthorization(
      new xdr.HashIdPreimageSorobanAuthorization({
        networkId: hash(Buffer.from(await this._rpc.network())),
        nonce: credentials.nonce(),
        signatureExpirationLedger: credentials.signatureExpirationLedger(),
        invocation: entry.rootInvocation(),
      })
    );

    const payload = hash(preimage.toXDR());

    const signature = this._recipient.sign(payload);

    const shelterSignature = {
      public_key: this._recipient.rawPublicKey(),
      signature,
    };

    const shelter = new Client({
      contractId: this._shelterId,
      networkPassphrase: await this._rpc.network(),
      rpcUrl: this._rpc.url(),
    });

    const scValType = xdr.ScSpecTypeDef.scSpecTypeUdt(
      new xdr.ScSpecTypeUdt({ name: "Pass" })
    );

    const scVal = shelter.spec.nativeToScVal(shelterSignature, scValType);

    switch (credentials.signature().switch().name) {
      case "scvVoid":
        credentials.signature(scVal);
        break;
      default:
        throw new Error("Unsupported signature");
    }

    return entry;
  }
}
