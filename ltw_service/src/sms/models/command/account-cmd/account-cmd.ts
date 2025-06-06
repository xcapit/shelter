import { Beneficiaries } from "../../../../beneficiaries/models/beneficiaries/beneficiaries";
import { Command } from "../command.interface";

export class AccountCmd implements Command {

  constructor(private _aPhoneNumber: string, private _beneficiaries: Beneficiaries) {}

  destinationNumber(): string {
    return this._aPhoneNumber;
  }

  async bodyResponse(): Promise<string> {
    return (await this._beneficiaries.findOneBy(this._aPhoneNumber)).address();
  }
}
