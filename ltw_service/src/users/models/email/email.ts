import {object, string} from "yup";

export class Email {

  private _rules = object({
    email: string().required().email()
  })

  constructor(private readonly _anEmailValue: string) {
    this._rules.validateSync({ email: _anEmailValue });
  }

  toString(): string {
    return this._anEmailValue;
  }
}
