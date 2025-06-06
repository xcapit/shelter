import { FakeMongoModel } from "../../../../db/mongo/fake-mongo/fake-mongo.model";
import { rawOffRampResponse } from "../../../../fixtures/raw-off-ramp-response-data";
import { DefaultOffRampDataRepo } from "./default-off-ramp-data-repo";

describe("DefaultOffRampDataRepo", () => {
  let offRampDataRepo: DefaultOffRampDataRepo;

  beforeEach(() => {
    offRampDataRepo = new DefaultOffRampDataRepo(
        new FakeMongoModel().create()
    )
  });

  test("new", () => {
    expect(offRampDataRepo).toBeTruthy();
  });

  test("save", async () => {
    expect(
      await offRampDataRepo.save(rawOffRampResponse)
    ).toBeUndefined();
  });
})
