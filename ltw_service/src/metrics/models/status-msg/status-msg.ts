export class StatusMsg {
  constructor(private _aMsg: string) {
  }

  public toJson(): any {
    return {status: this._aMsg}
  }
}
