import {object, string} from "yup";
import bcryptjs from "bcryptjs";
const {hashSync} = bcryptjs;

export class Password {

  private _rules = object({
    password: string().required()
  })

  constructor(private readonly _value: string) {
    this._rules.validateSync({password: _value});
  }

  hash(): string {
    return hashSync(this._value, 10);
  }

  toString(): string {
    return this._value;
  }
}
