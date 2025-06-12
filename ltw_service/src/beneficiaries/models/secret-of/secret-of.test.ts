import { rawBeneficiaryData } from "../../../../fixtures/raw-beneficiary-data";
import { FakeTwilio } from "../../../../sms/models/fake-twilio/fake-twilio";
import { Beneficiaries } from "../../beneficiaries/beneficiaries";
import { FakeBeneficiariesDataRepo } from "../../data-repo/beneficiaries-data-repo/fake/fake-beneficiaries-data-repo";

describe("SecretOf", () => {
  let secretOf: SecretOf;

  beforeEach(() => {
    secretOf = new SecretOf("", new Beneficiaries(new FakeBeneficiariesDataRepo()));
  });

  test("new", () => {
    expect(secretOf).toBeTruthy();
  });

//   test("value", async () => {
//     expect(await privateKeyOf.value()).toEqual(
//       rawBeneficiaryData.ownerPrivateKey
//     );
//   });
});
