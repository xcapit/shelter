import type { Keypair } from "shelter-sdk";

export class DefautlPass {
  constructor(
    private readonly _recipient: Keypair,
    private readonly _shelterId: string
  ) {}
}
