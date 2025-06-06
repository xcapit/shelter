import jsonwebtoken from "jsonwebtoken";
import {object, string} from "yup";
import dotenv from "dotenv";
import process from "process";

const {sign} = jsonwebtoken;

dotenv.config();

const {JWT_SECRET, JWT_EXPIRATION_TIME} = process.env as { JWT_SECRET: string, JWT_EXPIRATION_TIME: string };


export class JWT {

  private _rules = object({
    username: string().required(),
    secret: string().required(),
    expirationTime: string().required(),
  });

  constructor(
    private readonly _anUsername: string,
    private readonly _aSecret: string = JWT_SECRET,
    private readonly _anExpirationTime: string = JWT_EXPIRATION_TIME
  ) {
    this._rules.validateSync({username: _anUsername, secret: _aSecret, expirationTime: _anExpirationTime});
  }

  toString(): string {
    return sign({username: this._anUsername}, this._aSecret, {expiresIn: this._anExpirationTime});
  }
}
