import { OffRampResponse } from "../off-ramp-providers/providers-response.interface";

export interface OffRampDataRepo {
  save(rawData: OffRampResponse): Promise<any>;
}
