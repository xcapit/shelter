export class FakePass {
  constructor() { }

  async applyTo(tx: any) {
    return tx;
  }
}
