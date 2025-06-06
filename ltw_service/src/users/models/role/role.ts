import { object, string } from 'yup';

export class Role {
  private static readonly ALLOWED_ROLES = [
    'Admin',
    'Beneficiary',
    'Merchant',
    'NGO',
  ] as const;

  private _rules = object({
    role: string().oneOf(Role.ALLOWED_ROLES).required(),
  });

  constructor(private readonly _aRoleValue: string) {
    this._rules.validateSync({ role: _aRoleValue });
  }

  toString(): string {
    return this._aRoleValue;
  }
}
