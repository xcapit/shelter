import { contract, hash, xdr, type Keypair } from "shelter-sdk";

export class DefaultPass {
  constructor(
    private readonly _recipient: Keypair,
    private readonly _shelterId: string
  ) {}

  async applyTo(tx: any) {
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
      const { sequence } = await rpcServer.getLatestLedger(); // DefaultRpc
      expiration = sequence + contract.DEFAULT_TIMEOUT / 5;
    }
    credentials.signatureExpirationLedger(expiration);

    const preimage = xdr.HashIdPreimage.envelopeTypeSorobanAuthorization(
      new xdr.HashIdPreimageSorobanAuthorization({
        networkId: hash(Buffer.from(Networks.TESTNET)), // Network
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

      const shelter = new Shelter({  // Client (Shelter)
        contractId: this._shelterId,
        networkPassphrase: Networks.TESTNET, // Network
        rpcUrl: rpcUrl, // DefualtRpc -> URL
      });
      const scValType = xdr.ScSpecTypeDef.scSpecTypeUdt(
        new xdr.ScSpecTypeUdt({ name: "Pass" })
      );

      const scVal = shelter.spec.nativeToScVal(shelterSignature, scValType);
  }
}

// async _signAuthEntry(
//   entry: xdr.SorobanAuthorizationEntry,
//   options: {
//     keypair: Keypair;
//   }
// ) {
//   const credentials = entry.credentials().address();

//   let expiration = credentials.signatureExpirationLedger();

//   if (!expiration) {
//     const { sequence } = await rpcServer.getLatestLedger();
//     expiration = sequence + contract.DEFAULT_TIMEOUT / 5;
//   }
//   credentials.signatureExpirationLedger(expiration);

//   const preimage = xdr.HashIdPreimage.envelopeTypeSorobanAuthorization(
//     new xdr.HashIdPreimageSorobanAuthorization({
//       networkId: hash(Buffer.from(Networks.TESTNET)),
//       nonce: credentials.nonce(),
//       signatureExpirationLedger: credentials.signatureExpirationLedger(),
//       invocation: entry.rootInvocation(),
//     })
//   );

//   const payload = hash(preimage.toXDR());

//   const signature = options.keypair.sign(payload);

//   const shelterSignature = {
//     public_key: options.keypair.rawPublicKey(),
//     signature: signature,
//   };

//   const shelter = new Shelter({
//     contractId: shelterAddress,
//     networkPassphrase: Networks.TESTNET,
//     rpcUrl: rpcUrl,
//   });
//   const scValType = xdr.ScSpecTypeDef.scSpecTypeUdt(
//     new xdr.ScSpecTypeUdt({ name: "Pass" })
//   );

//   const scVal = shelter.spec.nativeToScVal(shelterSignature, scValType);

//   switch (credentials.signature().switch().name) {
//     case "scvVoid":
//       console.log("add in void");
//       credentials.signature(scVal);
//       break;
//     case "scvVec":
//       // Add the new signature to the existing map
//       // TODO: ?
//       // credentials.signature().vec()?.[0].map()?.push(scVal)
//       console.log("add vec?");
//       // Order the map by key
//       // Not using Buffer.compare because Symbols are 9 bytes and unused bytes _append_ 0s vs prepending them, which is too bad
//       credentials
//         .signature()
//         .vec()?.[0]
//         .map()
//         ?.sort((a, b) => {
//           return (
//             a.key().vec()![0].sym() + a.key().vec()![1].toXDR().join("")
//           ).localeCompare(
//             b.key().vec()![0].sym() + b.key().vec()![1].toXDR().join("")
//           );
//         });
//       break;
//     default:
//       throw new Error("Unsupported signature");
//   }

//   return entry;
// }

// async _sign(txn: any, options: { keypair: Keypair }) {
//   await txn.signAuthEntries({
//     address: shelterAddress,
//     authorizeEntry: (entry: any) => {
//       const clone = xdr.SorobanAuthorizationEntry.fromXDR(entry.toXDR());
//       return _signAuthEntry(clone, options);
//     },
//   });

//   return txn;
// }
