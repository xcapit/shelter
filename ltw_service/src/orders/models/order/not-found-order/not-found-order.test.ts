import { BeneficiaryOrder } from "../beneficiary-order.interface";
import {NotFoundOrder} from "./not-found-order";

describe("NullBeneficiaryOrder", () => {
  let nullBeneficiaryOrder: BeneficiaryOrder;

  beforeEach(() => {
    nullBeneficiaryOrder = new NotFoundOrder();
  });

  test("new", () => {
    expect(nullBeneficiaryOrder).toBeTruthy();
  });

  test("token", () => {
    expect(() => nullBeneficiaryOrder.tokenSymbol()).toThrow();
  });

  test("amount", () => {
    expect(() => nullBeneficiaryOrder.amount()).toThrow();
  });

  test("phoneNumber", () => {
    expect(() => nullBeneficiaryOrder.phoneNumber()).toThrow();
  });

  test("merchAddress", () => {
    expect(() => nullBeneficiaryOrder.merchAddress()).toThrow();
  });

  test("otp", () => {
    expect(() => nullBeneficiaryOrder.otp()).toThrow();
  });

  test("isExpired", () => {
    expect(() => nullBeneficiaryOrder.isExpired()).toThrow();
  });

  test("status", () => {
    expect(() => nullBeneficiaryOrder.status()).toThrow();
  });
});
