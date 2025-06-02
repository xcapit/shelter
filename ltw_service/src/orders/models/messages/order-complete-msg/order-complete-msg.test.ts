// TODO:
// import {SmsMsg} from "../../../../shared/messages/sms-msg.interface";
// import {MultiLanguage} from "../../../../system/multi-language/multi-language";
// import i18next from "i18next";
// import {OrderCompleteMsg} from "./order-complete-msg";
// import { AmountOf } from "../../../../beneficiaries/models/amount-of/amount-of";
// import { Token } from "../../../../beneficiaries/models/token/token.interface";
// import { rawUSDCData } from "../../../../fixtures/raw-tokens-data";
// import { DefaultToken } from "../../../../beneficiaries/models/token/default-token/default-token";

// describe("OrderCompleteMsg", () => {
//   let orderCompleteMsg: SmsMsg;
//   let amount: AmountOf;
//   const usdcToken: Token = new DefaultToken(rawUSDCData);
//   const aWeiAmount = BigInt(1112000);

//   beforeAll(() => {
//     new MultiLanguage(i18next).init();
//   });

//   beforeEach(() => {
//     amount = new AmountOf(aWeiAmount, usdcToken);
//     orderCompleteMsg = new OrderCompleteMsg(amount, usdcToken);
//   });

//   test("new", () => {
//     expect(orderCompleteMsg).toBeTruthy();
//   });

//   test("toString", () => {
//     expect(orderCompleteMsg.toString()).toEqual('Your order has been completed! Your balance is 1.11 USDC.');
//   });
// });
