import {
  MessageInstance,
  MessageListInstance,
} from 'twilio/lib/rest/api/v2010/account/message';

export class FakeTwilio {
  constructor(
    private countryCode = 'US',
    private lineTypeIntelligence: { carrier_name?: string } = {
      carrier_name: 'AT&T',
    },
    private valid = true,
  ) {}

  messages = {
    create: () => Promise.resolve({} as MessageInstance),
  } as unknown as MessageListInstance;

  lookups = {
    v2: {
      phoneNumbers: (phoneNumber: string) => ({
        fetch: async () => {
          if (this.valid) {
            return Promise.resolve({
              phoneNumber: phoneNumber,
              countryCode: this.countryCode,
              lineTypeIntelligence: this.lineTypeIntelligence,
              valid: this.valid,
            });
          } else {
            return Promise.resolve({
              phoneNumber: phoneNumber,
              countryCode: null,
              lineTypeIntelligence: null,
              valid: this.valid,
            });
          }
        },
      }),
    },
  };
}
