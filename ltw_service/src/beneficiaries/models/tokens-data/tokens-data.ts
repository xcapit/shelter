import dotenv from "dotenv";
import process from "process";
import { tokens } from "../../../constants/tokens/tokens.prod";
import { tokensDev } from "../../../constants/tokens/tokens.dev";
import { RawToken } from "../../../constants/tokens/raw-token.type";

dotenv.config();

const { PRODUCTION } = process.env;

export class TokensData {
  value(): RawToken[] {
    return +PRODUCTION! ? tokens : tokensDev;
  }
}