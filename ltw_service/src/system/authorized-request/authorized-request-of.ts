import { Request } from "express";
import {VerifiedJWT} from "../../users/models/verified-jwt/verified-jwt";
import {BearerAuthOf} from "../bearer-auth-of/bearer-auth-of";

export class AuthorizedRequestOf {

  private _verifiedJWT: VerifiedJWT;

  constructor(private _aRequest: Request) {
    this._validate();
  }

  username(): string {
    return this._verifiedJWT.username();
  }

  body(): any {
    return this._aRequest.body;
  }

  params(): any {
    return this._aRequest.params;
  }

  query(): any {
    return this._aRequest.query;
  }

  private _validate() {
    this._verifiedJWT = new VerifiedJWT(new BearerAuthOf(this._aRequest).token());
  }
}
