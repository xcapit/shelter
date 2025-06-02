import {StatusMsg} from "./status-msg";

describe('Status Msg', () => {
  const aTestMsg = 'A test message';

  test('toJson', () => {
    expect(new StatusMsg(aTestMsg).toJson().status).toEqual(aTestMsg);
  });
});
