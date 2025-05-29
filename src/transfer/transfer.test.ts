export class Transfer {
  constructor(
    private readonly _from: string,
    private readonly _to: string,
    private readonly _amount: bigint,
    private readonly _token: string
  ) {}
}

describe("transfer", () => {
  const from = "";
  const to = "";
  const amount = BigInt(1);
  const token = "";
  const recipient = "";

  test("new", () => {
    expect(new Transfer(from, to, amount, token)).toBeTruthy();
  });

  test("execute", () => {
    expect(new Transfer(from, to, amount, token).execute()).toBeTruthy();
  });
});
