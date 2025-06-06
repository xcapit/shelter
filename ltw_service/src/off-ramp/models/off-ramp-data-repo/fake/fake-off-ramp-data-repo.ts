import { OffRampDataRepo } from "../off-ramp-data-repo.interface";

export class FakeOffRampDataRepo implements OffRampDataRepo {

  save(rawData: any): Promise<any> {
    return Promise.resolve(rawData);
  }
}
