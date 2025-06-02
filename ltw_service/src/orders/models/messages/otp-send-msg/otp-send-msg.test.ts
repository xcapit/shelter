import { rawUSDCData } from "../../../../fixtures/raw-tokens-data";
import { OTP } from "../../../../beneficiaries/models/otp/otp";
import { DefaultToken } from "../../../../beneficiaries/models/token/default-token/default-token";
import { SmsMsg } from "../../../../shared/messages/sms-msg.interface";
import { OTPSendMsg } from "./otp-send-msg";
import {MultiLanguage} from "../../../../system/multi-language/multi-language";
import i18next from "i18next";

describe("OTPSendMsg", () => {
  let otpSendMsg: SmsMsg;

  beforeAll(() => {
    new MultiLanguage(i18next).init();
  });

  beforeEach(() => {
    otpSendMsg = new OTPSendMsg(new OTP(), 10, new DefaultToken(rawUSDCData));
  });

  test("new", () => {
    expect(otpSendMsg).toBeTruthy();
  });

  test("toString", () => {
    expect(otpSendMsg.toString()).toContain(rawUSDCData.symbol);
  });
});
