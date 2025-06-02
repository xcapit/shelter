import dotenv from "dotenv";
import process from "process";

dotenv.config();

const { TTL_AS_MINUTES } = process.env;

export class TTL {

  constructor(
    private _minutes: number = +TTL_AS_MINUTES!,
    private _aDate: Date = new Date()
  ) {}

  expirationDate(): number {
    return this._aDate.getTime() + this._minutes * 60 * 1000;
  }
}
