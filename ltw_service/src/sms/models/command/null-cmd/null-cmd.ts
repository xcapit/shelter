import { Command } from "../command.interface";

export class NullCommand implements Command {

  constructor(private _aPhoneNumber: string) {}

  destinationNumber(): string {
      return this._aPhoneNumber;
  }

  bodyResponse(): Promise<string> {
    return Promise.resolve("Command not found!");
  }
}
