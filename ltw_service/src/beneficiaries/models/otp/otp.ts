import { generate } from "randomstring";

export class OTP {

  private _cachedValue: string;

  value(): string {
    if (!this._cachedValue) {
      this._cachedValue = generate({
        length: 6,
        charset: "numeric",
      });
    }
    return this._cachedValue; 
  }
}
