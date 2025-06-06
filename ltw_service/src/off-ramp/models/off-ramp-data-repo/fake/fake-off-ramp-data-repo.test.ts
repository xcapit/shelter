import { rawOffRampResponse } from "../../../../fixtures/raw-off-ramp-response-data";
import { OffRampDataRepo } from "../off-ramp-data-repo.interface";
import { FakeOffRampDataRepo } from "./fake-off-ramp-data-repo";

describe("FakeOffRampDataRepo", () => {
  let aFakeDataRepo: OffRampDataRepo;

  beforeEach(() => {
    aFakeDataRepo = new FakeOffRampDataRepo();
  });

  test("new", () => {
    expect(aFakeDataRepo).toBeTruthy();
  });

  test("save", async () => {
    expect(await aFakeDataRepo.save(rawOffRampResponse)).toBe(rawOffRampResponse);
  });

});
