import { rawBeneficiaryOrder } from "../../../fixtures/raw-beneficiary-order";
import { rawBeneficiaryData } from "../../../fixtures/raw-beneficiary-data";
import { Orders } from "./orders";
import { DefaultOrder } from "../order/default-order/default-order";
import { FakeBeneficiaryOrdersDataRepo } from "../../../beneficiaries/models/data-repo/beneficiary-orders-data-repo/fake/fake-beneficiary-orders-data-repo";
import { OrderOfReqBody } from "../order-of-req-body/order-of-req-body";

describe("BeneficiaryOrders", () => {
  let beneficiaryOrders: Orders;

  beforeEach(() => {
    beneficiaryOrders = new Orders(
      new FakeBeneficiaryOrdersDataRepo(rawBeneficiaryOrder)
    );
  });

  test("new", () => {
    expect(beneficiaryOrders).not.toBeNull();
  });

  test("save", async () => {
    const aFakeOrderOfReqBody = {
      toJson: () => {
        return {
          amount: 0.1,
          token: "USDC",
          phoneNumber: rawBeneficiaryData.phoneNumber,
          merchAddress: "0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC",
          description: "Fruit"
        };
      }
    } as unknown as OrderOfReqBody;

    expect(
      await beneficiaryOrders.save(aFakeOrderOfReqBody)
    ).toBeUndefined();
  });

  test("findOneByOTPandPhoneNumber", async () => {
    expect(await beneficiaryOrders.findOneByOTPandPhoneNumber("anOTP", "phoneNumber")).toEqual(
      new DefaultOrder(rawBeneficiaryOrder)
    );
  });

  test("findOneById", async () => {
    expect(await beneficiaryOrders.findOneById("Id")).toEqual(
      new DefaultOrder(rawBeneficiaryOrder)
    );
  });

  test("findLatestBy", async () => {
    expect(await beneficiaryOrders.findLatestBy("phoneNumber")).toEqual(
      [new DefaultOrder(rawBeneficiaryOrder)]
    );
  });

  test("findOneBy null beneficiary order", async () => {
    const beneficiaryOrders = new Orders(
      new FakeBeneficiaryOrdersDataRepo(null)
    );
    const aBeneficiaryOrder = await beneficiaryOrders.findOneByOTPandPhoneNumber(
      rawBeneficiaryOrder.otp,
      rawBeneficiaryOrder.phoneNumber
    );

    expect(() => aBeneficiaryOrder.phoneNumber()).toThrow();
  });

  test("completeOrder", async () => {
    expect(
      await beneficiaryOrders.completeOrder(
        new DefaultOrder(rawBeneficiaryOrder)
      )
    ).toBeTruthy();
  });

  test("validateOrder", async () => {
    expect(
      async () =>
        await beneficiaryOrders.validateOrder(
          new DefaultOrder(rawBeneficiaryOrder)
        )
    ).rejects.toThrow();
  });
});
