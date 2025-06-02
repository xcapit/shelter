import { JWT } from '../../users/models/jwt/jwt';
import { AuthorizedRequestOf } from '../authorized-request/authorized-request-of';
import { Limit } from './limit';
import {rawRequest, rawEmail} from "../../fixtures/raw-request-data";

describe('limit', () => {

  const requests = new AuthorizedRequestOf(
    rawRequest(`Bearer ${new JWT(rawEmail)}`),
  );
  const limit = new Limit(requests);

  test('new', () => {
    expect(limit).toBeTruthy();
  });

  test('to Int', () => {
    expect(limit.toInt()).toBeTruthy();
  });

  test('to Int limit not valid', () => {
    const rawRequest = (returnValue: string): any => {
      return {
        header: () => returnValue,
        query: {limit:'$2'},
      };
    }
    const limit = new Limit(new AuthorizedRequestOf(rawRequest(`Bearer ${new JWT(rawEmail)}`)));

    expect(limit.toInt()).toEqual(5);
  });

  test('to Int limit does not exist', () => {
    const rawRequest = (returnValue: string): any => {
      return {
        header: () => returnValue,
        query: {},
      };
    }
    const limit = new Limit(new AuthorizedRequestOf(rawRequest(`Bearer ${new JWT(rawEmail)}`)));

    expect(limit.toInt()).toEqual(5);
  });
});
