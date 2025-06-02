import { rawPhoneNumberUpdate } from "../../../../../fixtures/raw-phone-number-update-data";
import { DefaultPhoneNumberUpdate } from "../../../phone-number-update/default-phone-number-update/default-phone-number-update";
import { PhoneNumberUpdatesDataRepo } from "../phone-number-updates-data-repo.interface";
import { FakePhoneNumberUpdatesDataRepo } from "./fake-phone-number-updates-data-repo";

describe("PhoneNumberUpdatesDataRepo", () => {
  let aFakeDataRepo: PhoneNumberUpdatesDataRepo;

  beforeEach(() => {
    aFakeDataRepo = new FakePhoneNumberUpdatesDataRepo();
  });

  test("new", () => {
    expect(aFakeDataRepo).toBeTruthy();
  });

  test("save", async () => {
    expect(await aFakeDataRepo.save(rawPhoneNumberUpdate)).toBeUndefined();
  });

  test("findOneBy", async () => {
    expect(await aFakeDataRepo.findOneBy("", "")).toBeTruthy();
  });

  test("findOneBy not found", async () => {
    aFakeDataRepo = new FakePhoneNumberUpdatesDataRepo(null);

    expect(await aFakeDataRepo.findOneBy("", "")).toBeNull();
  });

  test("update", async () => {
    expect(
      await aFakeDataRepo.update({} as DefaultPhoneNumberUpdate, "")
    ).toBeTruthy();
  });
});
