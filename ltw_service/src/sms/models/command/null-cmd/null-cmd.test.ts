import { Command } from "../command.interface";
import { NullCommand } from "./null-cmd";

describe("NullCommand", () => {
  let nullCommand: Command;
  const aTestPhoneNumber = "1234";

  beforeEach(() => {
    nullCommand = new NullCommand(aTestPhoneNumber);
  });

  test("new", () => {
    expect(nullCommand).toBeTruthy();
  });

  test("bodyResponse", async () => {
    expect(await nullCommand.bodyResponse()).toBeTruthy();
  });

  
  test("destinationNumber", () => {
    expect(nullCommand.destinationNumber()).toEqual(aTestPhoneNumber);
  });
});
