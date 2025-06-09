export class AidTTL {

  constructor(
    private _days: number,
    private _aDate: Date = new Date()
  ) { }

  expirationDate(): number {
    return this._aDate.getTime() + this._days * 60 * 1000 * 24 * 60;
  }
}
