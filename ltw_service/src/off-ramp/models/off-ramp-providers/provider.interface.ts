import { Beneficiary } from "../../../beneficiaries/models/beneficiary/beneficiary.interface";
import { Token } from "../../../beneficiaries/models/token/token.interface";
import { OffRampResponse } from "./providers-response.interface";

export interface Provider {
  execute(): Promise<OffRampResponse>;
  amount(): number;
  token(): Token;
  currency(): string;
  beneficiary(): Beneficiary;
}
