import { rawBeneficiaryData } from "../../../../fixtures/raw-beneficiary-data";
import { FakeTwilio } from "../../../../sms/models/fake-twilio/fake-twilio";
import { Beneficiaries } from "../../beneficiaries/beneficiaries";
import { FakeBeneficiariesDataRepo } from "../../data-repo/beneficiaries-data-repo/fake/fake-beneficiaries-data-repo";
import { SecretOf } from "./private-key-of";

describe("SecretOf", () => {
  let secretOF: SecretOf;

  beforeEach(() => {
    secretOF = new SecretOf("", new Beneficiaries(new FakeBeneficiariesDataRepo()));
  });

  test("new", () => {
    expect(secretOF).toBeTruthy();
  });

//   test("value", async () => {
//     expect(await privateKeyOf.value()).toEqual(
//       rawBeneficiaryData.ownerPrivateKey
//     );
//   });
});
