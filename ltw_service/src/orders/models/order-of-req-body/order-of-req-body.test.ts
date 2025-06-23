import { Beneficiaries } from "../../../beneficiaries/models/beneficiaries/beneficiaries";
import {
  FakeBeneficiariesDataRepo
} from "../../../beneficiaries/models/data-repo/beneficiaries-data-repo/fake/fake-beneficiaries-data-repo";
import { Tokens } from "../../../beneficiaries/models/tokens/tokens";
import { TokenRepo } from "../../../beneficiaries/models/token-repo/token-repo";
import { rawTokensData } from "../../../fixtures/raw-tokens-data";
import { rawBeneficiaryData } from "../../../fixtures/raw-beneficiary-data";
import { OrderOfReqBody } from "./order-of-req-body";
import { MultiLanguage } from "../../../system/multi-language/multi-language";
import i18next from "i18next";
import { FakeTwilio } from "../../../sms/models/fake-twilio/fake-twilio";


describe('order of req body', () => {
  const tokens = new Tokens(new TokenRepo(rawTokensData));
  const beneficiaries = new Beneficiaries(new FakeBeneficiariesDataRepo(), new FakeTwilio());

  const _aTestReqBody = (
    amount: number = 0.1,
    token: string = "BO1",
    phoneNumber: string = rawBeneficiaryData.phoneNumber,
    merchAddress: string = rawBeneficiaryData.address,
    description: string = "Fruit"
  ) => {
    return { amount, token, phoneNumber, description, merchAddress }
  };

  const _assertJsonOrderWithoutOTP = (jsonOrder: any) => {
    expect(jsonOrder).toBeTruthy();
    expect(jsonOrder.token).toBeTruthy();
    expect(jsonOrder.amount).toBeTruthy();
    expect(jsonOrder.phoneNumber).toBeTruthy();
    expect(jsonOrder.description).toBeTruthy();
    expect(jsonOrder.merchAddress).toBeTruthy();
    expect(jsonOrder.expirationDate).toBeTruthy();
  };

  const _assertJsonOrder = (jsonOrder: any) => {
    expect(jsonOrder.otp).toBeTruthy();
    _assertJsonOrderWithoutOTP(jsonOrder);
  };

  beforeAll(() => {
    new MultiLanguage(i18next).init();
  });

  test('validation on request body', () => {
    expect(() => new OrderOfReqBody({}, beneficiaries, tokens)).toThrow();
    expect(() => new OrderOfReqBody(_aTestReqBody(0), beneficiaries, tokens)).toThrow();
    expect(() => new OrderOfReqBody(_aTestReqBody(0.1, ''), beneficiaries, tokens)).toThrow();
    expect(() => new OrderOfReqBody(_aTestReqBody(0.1, 'LI', ''), beneficiaries, tokens)).toThrow();
    expect(() => new OrderOfReqBody(_aTestReqBody(0.1, 'LI', '12', ''), beneficiaries, tokens)).toThrow();
    expect(() => new OrderOfReqBody(_aTestReqBody(0.1, 'LI', '12', 'F', ''), beneficiaries, tokens)).not.toThrow();
  });

  test('toJson', async () => {
    const jsonOrder = await new OrderOfReqBody(_aTestReqBody(), beneficiaries, tokens).toJson();

    _assertJsonOrder(jsonOrder);
  });

  test('toSecureJson', async () => {
    const jsonOrder = await new OrderOfReqBody(_aTestReqBody(), beneficiaries, tokens).toSecureJson();

    _assertJsonOrderWithoutOTP(jsonOrder);
    expect(jsonOrder.otp).toBeUndefined();
  });

  test('otpMsg', async () => {
    const stringOrder = await new OrderOfReqBody(_aTestReqBody(), beneficiaries, tokens).otpMsg();

    expect(stringOrder).toContain(_aTestReqBody().token);
  });

  test('beneficiary phone number', async () => {
    const order = new OrderOfReqBody(_aTestReqBody(), beneficiaries, tokens);

    expect(await order.beneficiaryPhoneNumber()).toEqual(_aTestReqBody().phoneNumber);
  });
});
