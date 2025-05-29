import type { Keypair } from "shelter-sdk";

export class DefaultPass {
  constructor(
    private readonly _recipient: Keypair,
    private readonly _shelterId: string
  ) {}

  async applyTo(tx: any) { 

    
  }
}
