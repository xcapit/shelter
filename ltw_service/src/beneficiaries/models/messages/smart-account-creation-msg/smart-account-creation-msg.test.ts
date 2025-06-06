import { smartAccountAddress } from "../../../../fixtures/raw-wallet-data";
import { SmartAccountCreationMsg } from "./smart-account-creation-msg";
import {MultiLanguage} from "../../../../system/multi-language/multi-language";
import i18next from "i18next";

describe("Smart Account Creation Msg", () => {
  let msg: SmartAccountCreationMsg;

  beforeAll(() => {
    new MultiLanguage(i18next).init();
  });

  beforeEach(() => {
    msg = new SmartAccountCreationMsg(smartAccountAddress);
  });

  test("new", () => {
    expect(msg).toBeTruthy();
  });

  test("toString", () => {
    expect(msg.toString()).toContain(smartAccountAddress);
  });
});
