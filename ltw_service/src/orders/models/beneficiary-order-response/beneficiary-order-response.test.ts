import { rawBeneficiaryOrder } from '../../../fixtures/raw-beneficiary-order';
import { DefaultOrder } from '../order/default-order/default-order';
import { BeneficiaryOrderResponse } from './beneficiary-order-response';

describe('beneficiary order response', () => {
  const beneficiaryOrderResponse = new BeneficiaryOrderResponse(
    new DefaultOrder(rawBeneficiaryOrder),
  );
  const _aTestResponseBody = {
    _id: '67c865ffdc2e66a610d3a8f1',
    amount: '10',
    token: 'USDC',
    phoneNumber: '+1234',
    merchAddress: 'GDIQCQETMJNQU7W4FRYA62ARS4JH32L45YDLZHS7CMOSMBD6OU7Z252T',
    description: 'A description',
    createdAt: '2024-12-23T18:11:50.625Z',
    updatedAt: '2024-12-23T18:11:50.625Z',
    success: true,
  };

  test('new', () => {
    expect(beneficiaryOrderResponse).toBeTruthy();
  });

  test('to json', () => {
    expect(beneficiaryOrderResponse.toJSON()).toEqual(_aTestResponseBody);
  });
});
