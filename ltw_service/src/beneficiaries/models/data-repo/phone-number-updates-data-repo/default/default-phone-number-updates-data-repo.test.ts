import { DefaultPhoneNumberUpdatesDataRepo } from "./default-phone-number-updates-data-repo";
import { PhoneNumberUpdatesDataRepo } from "../phone-number-updates-data-repo.interface";
import { rawPhoneNumberUpdate } from "../../../../../fixtures/raw-phone-number-update-data";
import { DefaultPhoneNumberUpdate } from "../../../phone-number-update/default-phone-number-update/default-phone-number-update";
import {FakeMongoModel} from "../../../../../db/mongo/fake-mongo/fake-mongo.model";

describe("DefaultPhoneNumberUpdatesDataRepo", () => {
  let dataRepo: PhoneNumberUpdatesDataRepo;

  beforeEach(() => {
    dataRepo = new DefaultPhoneNumberUpdatesDataRepo(
        new FakeMongoModel(rawPhoneNumberUpdate, rawPhoneNumberUpdate).create()
    );
  });

  test("new", () => {
    expect(dataRepo).toBeTruthy();
  });

  test("save", async () => {
    expect(await dataRepo.save(rawPhoneNumberUpdate)).toBeUndefined();
  });

  test("findOneBy", async () => {
    expect(
      await dataRepo.findOneBy(
        rawPhoneNumberUpdate.otp,
        rawPhoneNumberUpdate.actualPhoneNumber
      )
    ).toEqual(rawPhoneNumberUpdate);
  });

  test("update", async () => {
    expect(
      await dataRepo.update(
        new DefaultPhoneNumberUpdate(rawPhoneNumberUpdate),
        { otp: null }
      )
    ).toEqual(rawPhoneNumberUpdate);
  });
});
