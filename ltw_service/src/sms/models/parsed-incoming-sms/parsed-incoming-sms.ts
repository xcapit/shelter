import { IncomingSms } from "../incoming-sms/incoming-sms";

export class ParsedIncomingSms {
  constructor(private _anIncomingSms: IncomingSms) {}

  commandName(): string {
    return this._anIncomingSms.body().split(" ")[0].toUpperCase();
  }
  
  commandParams(): string[] {
    return this._anIncomingSms.body().split(" ").slice(1); 
  }

  phoneNumber(): string {
    return this._anIncomingSms.from();
  }
}
