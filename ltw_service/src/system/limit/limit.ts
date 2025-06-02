import { AuthorizedRequestOf } from '../authorized-request/authorized-request-of';

export class Limit {
  private _defaultValue = 5;

  constructor(private aRequest: AuthorizedRequestOf) {}

  public toInt() {
    return this._validQuery()
      ? parseInt(this.aRequest.query().limit, 10)
      : this._defaultValue;
  }

  private _validQuery(): boolean {
    if (!this.aRequest.query().limit || !/^[1-9][0-9]*$/.test(this.aRequest.query().limit)) {
      return false
    }
    return true
  }
}
