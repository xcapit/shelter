import { rpc } from "@stellar/stellar-sdk";

export class TxResult {

  constructor(private _txResultData: any, private _errorMsg: string) { }

  validatedData(): any {
    if (this._txResultData.status !== rpc.Api.GetTransactionStatus.SUCCESS) {
      console.log(this._errorMsg, JSON.stringify(this._txResultData, null, 2));
      throw new Error(this._errorMsg);
    }
    return this._txResultData;
  }
}
