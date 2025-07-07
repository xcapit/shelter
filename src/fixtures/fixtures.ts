import { rpc, xdr } from "@stellar/stellar-sdk";

export const contractAddressTxReponse = {
  returnValue: {
    address: (): xdr.ScAddress => {
      return xdr.ScAddress.scAddressTypeContract(
        Buffer.from(
          "227ca7b59a114b96adc361d1d5ce76cb1e2ffe6fa797296749638fded54f9550",
          "hex"
        )
      );
    },
  },
  status: rpc.Api.GetTransactionStatus.SUCCESS,
};

export const pollTxReponseSuccess = {
  status: rpc.Api.GetTransactionStatus.SUCCESS,
};

export const pollTxReponseNotFound = {
  status: rpc.Api.GetTransactionStatus.NOT_FOUND,
};

export class FakeStellarRpc {
  assembleTransaction(raw: any, simulation: any) {
    return {
      build: () => ({ sign: () => { } }),
    };
  }
}

export class FakeServer {
  public serverURL = "aServerUrl";
  constructor(private readonly _pollTransactionReponse: any = {}) { }

  getNetwork() {
    return Promise.resolve({ passphrase: "aPassphrase" });
  }

  sendTransaction(tx: any) {
    return { hash: "aTxHash" };
  }

  pollTransaction(hash: string) {
    return this._pollTransactionReponse;
  }

  async getLatestLedger(): Promise<any> {
    return { sequence: 1234 }
  }

  async simulateTransaction() {
    return {
      transactionData: {},
      minResourceFee: '123',
      result: {},
      stateChanges: [],
      id: '1234',
      latestLedger: 1234,
      events: [],
      _parsed: false
    };
  }
}
