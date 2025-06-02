import {SMSWebhookRequestOf} from "./sms-webhook-request-of";

describe('SMS Webhook Request Of', () => {
  const webhookUrl = 'https://mycompany.com/myapp.php?foo=1&bar=2';
  const authToken = '12345';
  const validSignature = 'RSOYDt4T1cUTdK1PDd93/VVr8B8=';
  const invalidSignature = 'RSOYDt4';
  const aTestBody = {
    CallSid: "CA1234567890ABCDE",
    Caller: "+14158675309",
    Digits: "1234",
    From: "+14158675309",
    To: "+18005551212",
  };

  const _aTestRequest = (returnValue: string): any => {
    return {
      header: (aHeaderName: string) => returnValue,
      body: aTestBody,
    }
  }

  test('body access', () => {
    const request = new SMSWebhookRequestOf(
      _aTestRequest(validSignature),
      authToken,
      webhookUrl,
    );

    expect(request.body()).toEqual(aTestBody);
  });

  test('throw an error on invalid request', () => {
    expect(() => (new SMSWebhookRequestOf(
      _aTestRequest(invalidSignature),
      authToken,
      webhookUrl,
    ))).toThrow();
  });
});
