export class IncomingSms {
  constructor(private _rawTwilioData: any) {}

  from(): string{
    return this._rawTwilioData.From;
  }

  body(): string{
    return this._rawTwilioData.Body;
  }
}

