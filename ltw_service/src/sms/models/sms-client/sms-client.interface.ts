export interface SMSClient {
  send(toPhoneNumber: string, aMsgBody: string): Promise<any>;
}
