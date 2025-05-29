export class FakeSAC {
  transfer({
    from,
    to,
    amount,
  }: {
    from: string;
    to: string;
    amount: bigint;
  }) {}
}
