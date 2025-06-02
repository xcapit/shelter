import { Model } from 'mongoose';
import { OffRampResponse } from '../../off-ramp-providers/providers-response.interface';
import { OffRampsModel } from '../../../../db/mongo/off-ramps.model';
import { OffRampDataRepo } from '../off-ramp-data-repo.interface';

export class DefaultOffRampDataRepo implements OffRampDataRepo {
  constructor(private _aModel: Model<any> = OffRampsModel) {}

  save(offRamp: OffRampResponse): Promise<any> {
    return this._aModel.create(offRamp);
  }
}
