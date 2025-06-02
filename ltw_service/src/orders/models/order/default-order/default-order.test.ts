// TODO:
// import { rawBeneficiaryOrder } from "../../../../fixtures/raw-beneficiary-order";
// import { BeneficiaryOrder } from "../beneficiary-order.interface";
// import { DefaultOrder } from "./default-order";

// describe("DefaultBeneficiaryOrder", () => {
//   let beneficiaryOrder: BeneficiaryOrder;

//   beforeEach(() => {
//     beneficiaryOrder = new DefaultOrder(rawBeneficiaryOrder);
//   });

//   test("new", () => {
//     expect(beneficiaryOrder).toBeTruthy();
//   });

//   test("token", () => {
//     expect(beneficiaryOrder.tokenSymbol()).toEqual(rawBeneficiaryOrder.token);
//   });

//   test("amount", () => {
//     expect(beneficiaryOrder.amount()).toEqual(rawBeneficiaryOrder.amount);
//   });

//   test("phoneNumber", () => {
//     expect(beneficiaryOrder.phoneNumber()).toEqual(
//       rawBeneficiaryOrder.phoneNumber
//     );
//   });

//   test("merchAddress", () => {
//     expect(beneficiaryOrder.merchAddress()).toEqual(rawBeneficiaryOrder.merchAddress);
//   });

//   test("otp", () => {
//     expect(beneficiaryOrder.otp()).toEqual(rawBeneficiaryOrder.otp);
//   });

//   test("isExpired", () => {
//     expect(beneficiaryOrder.isExpired()).toBeTruthy;
//   });

//   test("status success", () => {
//     expect(beneficiaryOrder.status()).toEqual('Order successfully completed');
//   });

//   test("status expired", () => {
//     let anBeneficiaryOrder = rawBeneficiaryOrder;
//     anBeneficiaryOrder.success = false;
//     anBeneficiaryOrder.expirationDate = new Date().getTime() - 1e6;
//     beneficiaryOrder = new DefaultOrder(anBeneficiaryOrder);

//     expect(beneficiaryOrder.status()).toEqual('Order expired');
//   });

//   test("status expired", () => {
//     let anBeneficiaryOrder = rawBeneficiaryOrder;
//     anBeneficiaryOrder.success = false;
//     anBeneficiaryOrder.expirationDate = new Date().getTime() + 1e6;
//     beneficiaryOrder = new DefaultOrder(anBeneficiaryOrder);

//     expect(beneficiaryOrder.status()).toEqual('Order pending completion');
//   });


// });
