import { NullBeneficiary } from "../../../beneficiary/null-beneficiary/null-beneficiary";
import { RawBeneficiary } from "../../../beneficiary/raw-beneficiary.type";
import { BeneficiariesDataRepo } from "../beneficiaries-data-repo.interface";
import { FakeBeneficiariesDataRepo } from "./fake-beneficiaries-data-repo";

describe("FakeBeneficiariesDataRepo", () => {
  let aFakeDataRepo: BeneficiariesDataRepo;

  beforeEach(() => {
    aFakeDataRepo = new FakeBeneficiariesDataRepo();
  });

  test("new", () => {
    expect(aFakeDataRepo).toBeTruthy();
  });

  test("save", async () => {
    expect(await aFakeDataRepo.save({} as RawBeneficiary)).toBeUndefined();
  });

  test("findOneBy", async () => {
    expect(await aFakeDataRepo.findOneBy("")).toBeTruthy();
  });

  test("findOneBy not found", async () => {
    aFakeDataRepo = new FakeBeneficiariesDataRepo(null);

    expect(await aFakeDataRepo.findOneBy("")).toBeNull();
  });

  test("findSecretsBy", async () => {
    expect(await aFakeDataRepo.findSecretsBy("")).toBeTruthy();
  });

  test("update", async () => {
    expect(await aFakeDataRepo.update(new NullBeneficiary(),{})).toBeTruthy();
  });

  test("updatePhoneNumber", async () => {
    expect(await aFakeDataRepo.updatePhoneNumber(new NullBeneficiary(), "")).toBeTruthy();
  });
});
