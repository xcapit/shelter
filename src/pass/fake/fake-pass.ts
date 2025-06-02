import type { Pass } from "../pass.interface";

export class FakePass implements Pass {
  constructor() { }

  async applyTo(tx: any) {
    return tx;
  }
}
