import { DefaultBeneficiariesDataRepo } from "./default-beneficiaries-data-repo";
import { rawBeneficiaryData } from "../../../../../fixtures/raw-beneficiary-data";
import { BeneficiariesDataRepo } from "../beneficiaries-data-repo.interface";
import { DefaultBeneficiary } from "../../../beneficiary/default-beneficiary/default-beneficiary";
import {FakeMongoModel} from "../../../../../db/mongo/fake-mongo/fake-mongo.model";

describe("DefaultBeneficiariesDataRepo", () => {
  let beneficiariesDataRepo: BeneficiariesDataRepo;

  beforeEach(() => {
    beneficiariesDataRepo = new DefaultBeneficiariesDataRepo(
        new FakeMongoModel(rawBeneficiaryData, rawBeneficiaryData).create()
    )
  });

  test("new", () => {
    expect(beneficiariesDataRepo).toBeTruthy();
  });

  test("save", async () => {
    expect(
      await beneficiariesDataRepo.save(rawBeneficiaryData)
    ).toBeUndefined();
  });

  test("findOneBy", async () => {
    expect(
      await beneficiariesDataRepo.findOneBy(rawBeneficiaryData.phoneNumber)
    ).toEqual(rawBeneficiaryData);
  });

  test("findSecretBy", async () => {
    expect(
      await beneficiariesDataRepo.findSecretBy(
        rawBeneficiaryData.phoneNumber
      )
    ).toEqual(rawBeneficiaryData);
  });

  test("update", async () => {
    expect(
      await beneficiariesDataRepo.update(new DefaultBeneficiary(rawBeneficiaryData), {phoneNumber: 'aNewPhoneNumber'})
    ).toEqual(rawBeneficiaryData);
  });

  test("updatePhoneNumber", async () => {
    expect(
      await beneficiariesDataRepo.updatePhoneNumber(new DefaultBeneficiary(rawBeneficiaryData), 'aNewPhoneNumber')
    ).toEqual(rawBeneficiaryData);
  });
});
