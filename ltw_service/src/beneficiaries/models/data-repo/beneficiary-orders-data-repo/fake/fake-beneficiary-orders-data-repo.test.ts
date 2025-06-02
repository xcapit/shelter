import { RawBeneficiaryOrder } from "../../../../../orders/models/order/raw-beneficiary-order.type";
import { BeneficiaryOrdersDataRepo } from "../beneficiary-orders-data-repo.interface";
import { FakeBeneficiaryOrdersDataRepo } from "./fake-beneficiary-orders-data-repo";
import {NotFoundOrder} from "../../../../../orders/models/order/not-found-order/not-found-order";

describe("FakeBeneficiaryOrdersDataRepo", () => {
  let aFakeDataRepo: BeneficiaryOrdersDataRepo;

  beforeEach(() => {
    aFakeDataRepo = new FakeBeneficiaryOrdersDataRepo();
  });

  test("new", () => {
    expect(aFakeDataRepo).toBeTruthy();
  });

  test("save", async () => {
    expect(await aFakeDataRepo.save({} as RawBeneficiaryOrder)).toBeUndefined();
  });

  test("findOneByOTPandPhoneNumber", async () => {
    expect(await aFakeDataRepo.findOneByOTPandPhoneNumber("", "")).toBeTruthy();
  });

  test("findOneByOTPandPhoneNumber not found", async () => {
    aFakeDataRepo = new FakeBeneficiaryOrdersDataRepo(null);

    expect(await aFakeDataRepo.findOneByOTPandPhoneNumber("", "")).toBeNull();
  });

  test("findOneById", async () => {
    expect(await aFakeDataRepo.findOneById("")).toBeTruthy();
  });

  test("findOneById not found", async () => {
    aFakeDataRepo = new FakeBeneficiaryOrdersDataRepo(null);

    expect(await aFakeDataRepo.findOneById("")).toBeNull();
  });

  test("findLatestBy", async () => {
    expect(await aFakeDataRepo.findLatestBy("", 10)).toBeTruthy();
  });

  test("findLatestBy not found", async () => {
    aFakeDataRepo = new FakeBeneficiaryOrdersDataRepo(null);

    expect(await aFakeDataRepo.findLatestBy("", 10)).toEqual([]);
  });

  test("update", async () => {
    expect(await aFakeDataRepo.update(new NotFoundOrder(),{})).toBeTruthy();
  });

});
