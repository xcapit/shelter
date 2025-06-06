import dotenv from "dotenv";
import process from "process";
import jsonwebtoken from "jsonwebtoken";
const {verify, decode} = jsonwebtoken;

dotenv.config();

const { JWT_SECRET } = process.env as { JWT_SECRET: string };

export class VerifiedJWT {

  constructor(private _aJWTValue: string, private _aSecret: string = JWT_SECRET) {
    verify(this._aJWTValue, this._aSecret);
  }

  username(): string {
    return (decode(this._aJWTValue) as any)?.username;
  }
}
