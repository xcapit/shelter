import { DefaultBeneficiaryOrdersDataRepo } from "./default-beneficiary-orders-data-repo";
import { rawBeneficiaryOrder } from "../../../../../fixtures/raw-beneficiary-order";
import { BeneficiaryOrdersDataRepo } from "../beneficiary-orders-data-repo.interface";
import { DefaultOrder } from "../../../../../orders/models/order/default-order/default-order";
import { FakeMongoModel } from "../../../../../db/mongo/fake-mongo/fake-mongo.model";

describe("DefaultBeneficiaryOrdersDataRepo", () => {
  let beneficiaryOrdersDataRepo: BeneficiaryOrdersDataRepo;

  beforeEach(() => {
    beneficiaryOrdersDataRepo = new DefaultBeneficiaryOrdersDataRepo(
      new FakeMongoModel(rawBeneficiaryOrder, rawBeneficiaryOrder).create()
    );
  });

  test("new", () => {
    expect(beneficiaryOrdersDataRepo).toBeTruthy();
  });

  test("save", async () => {
    expect(
      await beneficiaryOrdersDataRepo.save(rawBeneficiaryOrder)
    ).toBeUndefined();
  });

  test("findOneByOTPandPhoneNumber", async () => {
    expect(
      await beneficiaryOrdersDataRepo.findOneByOTPandPhoneNumber(
        rawBeneficiaryOrder.otp,
        rawBeneficiaryOrder.phoneNumber
      )
    ).toEqual(rawBeneficiaryOrder);
  });

  test("findOneById", async () => {
    expect(
      await beneficiaryOrdersDataRepo.findOneById(
        rawBeneficiaryOrder._id!
      )
    ).toEqual(rawBeneficiaryOrder);
  });

  test("findOneById using wrong Id", () => {
    expect(
      () => beneficiaryOrdersDataRepo.findOneById('1234')
    ).toThrow("Invalid Id format");
  });

  test("findLatestBy", async () => {
    expect(
      await beneficiaryOrdersDataRepo.findLatestBy(
        rawBeneficiaryOrder.phoneNumber,
        1
      )
    ).toEqual([rawBeneficiaryOrder]);
  });

  test("update", async () => {
    expect(
      await beneficiaryOrdersDataRepo.update(
        new DefaultOrder(rawBeneficiaryOrder),
        { otp: null, success: true }
      )
    ).toEqual(rawBeneficiaryOrder);
  });
});
