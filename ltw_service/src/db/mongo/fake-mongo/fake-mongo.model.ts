import {Model} from "mongoose";

export class FakeMongoModel {
  private _createdObjects: unknown[] = [];

  constructor(
    private _findOneResult: unknown = {},
    private _findOneAndUpdateResult: unknown = {},
  ) {}

  create(): Model<unknown> {
    return {
      create: (obj: unknown = null) => this._create(obj),
      find: () => ({
        sort: () => ({
          limit: () => ({
            lean: () => Promise.resolve(this._find()),
          }),
        }),
      }),
      findOne: () => ({
        lean: () => Promise.resolve(this._findOne()),
      }),
      findOneAndUpdate: () => ({
        lean: () => Promise.resolve(this._findOneAndUpdateResult),
      })
    } as unknown as Model<unknown>;
  }

  private _findOne() {
    return this._createdObjects.length ? this._createdObjects[0] : this._findOneResult;
  }

  private _find() {
    return this._createdObjects.length ? this._createdObjects : [this._findOneResult];
  }

  private _create(obj: unknown): Promise<void> {
    if (obj) {
      this._createdObjects.push(obj);
    }
    return Promise.resolve();
  }
}
