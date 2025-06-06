import dotenv from "dotenv";
import process from "process";
import TwilioSDK, { Twilio } from "twilio";
import {
  MessageInstance,
  MessageListInstanceCreateOptions,
} from "twilio/lib/rest/api/v2010/account/message";
import { FakeTwilio } from "../../fake-twilio/fake-twilio";
import { SMSClient } from "../sms-client.interface";

dotenv.config();

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, MESSAGING_SERVICE_SID } =
  process.env;

export class TwilioSMSClient implements SMSClient {
  constructor(
    private _twilioClient: Twilio | FakeTwilio = TwilioSDK(
      TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN
    )
  ) {}

  async send(
    toPhoneNumber: string,
    aMsgBody: string
  ): Promise<MessageInstance> {
    return this._twilioClient.messages.create(
      this._message(toPhoneNumber, aMsgBody)
    );
  }

  private _message(
    toPhoneNumber: string,
    aMsgBody: string
  ): MessageListInstanceCreateOptions {
    return {
      body: aMsgBody,
      messagingServiceSid: MESSAGING_SERVICE_SID,
      to: toPhoneNumber,
    };
  }
}
