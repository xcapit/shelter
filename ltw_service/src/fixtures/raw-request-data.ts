export const rawBody = { test: 'test' };
export const rawParams = { param1: 'param1' };
export const rawEmail = 'test@test.com';
export const rawQuery = { limit: '5' };
export const rawRequest = (returnValue: string): any => {
  return {
    header: (aHeaderName: string) => returnValue,
    body: rawBody,
    params: rawParams,
    query: rawQuery,
  };
};
