import {FakeMongoModel} from "./fake-mongo.model";


describe('fake mongo model', () => {
  const findOneResultData = 'findOneResultData';
  const findOneAndUpdateData = 'findOneAndUpdateData';
  let fakeMongoModel: FakeMongoModel;

  beforeEach(() => {
    fakeMongoModel = new FakeMongoModel(
      findOneResultData,
      findOneAndUpdateData
    );
  });

  test('new', () => {
    expect(fakeMongoModel).toBeTruthy();
  });

  test('create fake mongo model', () => {
    expect(fakeMongoModel.create()).toBeTruthy();
  });

  test('create', async () => {
    const aTestObject = {name: 'name'};
    await fakeMongoModel.create().create(aTestObject);

    expect(await fakeMongoModel.create().findOne().lean()).toEqual(aTestObject);
  });

  test('find', async () => {
    expect(await fakeMongoModel.create().find().sort().limit(1).lean()).toEqual([findOneResultData]);
  });

  test('findOne', async () => {
    expect(await fakeMongoModel.create().findOne().lean()).toEqual(findOneResultData);
  });

  test('findOneAndUpdate', async () => {
    expect(await fakeMongoModel.create().findOneAndUpdate().lean()).toEqual(findOneAndUpdateData);
  });
})
