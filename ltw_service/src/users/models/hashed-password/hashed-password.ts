import {object, string} from "yup";
import bcryptjs from "bcryptjs";
const { compareSync } = bcryptjs;

export class HashedPassword {

  private _rules = object({
    _hashedPasswordValue: string().required()
  })

  constructor(private readonly _value: string) {
    this._rules.validateSync({ _hashedPasswordValue: this._value })
  }

  toString() {
    return this._value;
  }

  validate(aPasswordValue: string) {
    if (!compareSync(aPasswordValue, this._value)) {
      throw new Error('Invalid Password!');
    }
  }
}
