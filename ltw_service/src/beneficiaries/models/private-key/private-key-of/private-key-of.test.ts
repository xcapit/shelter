// TODO:
// import { rawBeneficiaryData } from "../../../../fixtures/raw-beneficiary-data";
// import { FakeTwilio } from "../../../../sms/models/fake-twilio/fake-twilio";
// import { Beneficiaries } from "../../beneficiaries/beneficiaries";
// import { FakeBeneficiariesDataRepo } from "../../data-repo/beneficiaries-data-repo/fake/fake-beneficiaries-data-repo";
// import { PrivateKey } from "../private-key.interface";
// import { PrivateKeyOf } from "./private-key-of";
//
// describe("PrivateKeyOf", () => {
//   let privateKeyOf: PrivateKey;
//
//   beforeEach(() => {
//     privateKeyOf = new PrivateKeyOf("", new Beneficiaries(new FakeBeneficiariesDataRepo(), new FakeTwilio()));
//   });
//
//   test("new", () => {
//     expect(privateKeyOf).toBeTruthy();
//   });
//
//   test("value", async () => {
//     expect(await privateKeyOf.value()).toEqual(
//       rawBeneficiaryData.ownerPrivateKey
//     );
//   });
// });
