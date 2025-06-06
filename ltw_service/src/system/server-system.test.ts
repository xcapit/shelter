import {ServerSystem} from "./server-system";
import { jest } from "@jest/globals";

describe('Server System', () => {
  let aTestObject: any;
  let aTestResponse: any;
  let server: ServerSystem;

  beforeEach(() => {
    server = new ServerSystem();
    aTestObject = { next: () => {}};
    aTestResponse = { send: () => true };
  });

  test('new', () => {
    expect(new ServerSystem()).toBeTruthy();
  });

  test('execute system action', async () => {
    jest.spyOn(aTestResponse, 'send');
    const anAction: CallableFunction = () => Promise.resolve(true);

    await server.executeAction(anAction, aTestResponse, aTestObject.next)

    expect(aTestResponse.send).toHaveBeenCalledTimes(1);
    expect(aTestResponse.send).toHaveBeenCalledWith(true);
  });

  test('fail execute system action', async () => {
    jest.spyOn(aTestObject, 'next');
    const anAction: CallableFunction = () => Promise.reject();

    await server.executeAction(anAction, aTestResponse, aTestObject.next)

    expect(aTestObject.next).toHaveBeenCalledTimes(1);
  });
})
