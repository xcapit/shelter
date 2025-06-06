import {object, string} from "yup";
import {Request} from "express";

export class BearerAuthOf {

  private _rules = object({
    authorizationHeader: string().required().matches(/Bearer\s+[a-zA-Z0-9-_]+/)
  });

  constructor(private _aRequest: Request) {
    this._rules.validateSync({ authorizationHeader: this._authValue() });
  }

  token(): string {
    return this._authValue().split(" ")[1];
  }

  private _authValue(): string {
    return this._aRequest.header('Authorization')!;
  }
}
