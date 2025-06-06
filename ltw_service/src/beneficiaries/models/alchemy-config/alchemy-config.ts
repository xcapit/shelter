import dotenv from "dotenv";
import process from "process";

dotenv.config();

const { ALCHEMY_API_KEY, ALCHEMY_GAS_POLICY_ID } = process.env;

export class AlchemyConfig {
  constructor(
    private _anApiKey: string = ALCHEMY_API_KEY!,
    private _aPolicyId: string = ALCHEMY_GAS_POLICY_ID!
  ) {}

  apiKey(): string {
    return this._anApiKey;
  }

  policyId(): string {
    return this._aPolicyId;
  }
}
