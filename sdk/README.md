# Shelter SDK

A TypeScript SDK for interacting with Shelter smart contracts on Stellar.

## Installation

```bash
npm install @xcapit/shelter-sdk
```

## Quick Start

```typescript
import { Foundry, Aid, Pass, Rpc } from "@xcapit/shelter-sdk";
import { Keypair, Networks } from "@stellar/stellar-sdk";

// Setup
const rpc = new Rpc(new rpc.Server("https://soroban-rpc.testnet.stellar.gateway.fm"));
const steward = Keypair.fromSecret("YOUR_STEWARD_SECRET");
const wasmHash = "YOUR_WASM_HASH";

// Deploy a new shelter
const foundry = new Foundry(steward, rpc, wasmHash);
const shelter = await foundry.newShelter();

// Bind aid to a recipient
const recipient = Keypair.random();
const aid = new Aid(recipient, recipient, sac, shelter, rpc);
await aid.bound(BigInt(100), BigInt(Date.now() + 3600)); // 100 tokens, 1 hour expiry

// Transfer aid
const pass = new Pass(recipient, shelter.id(), rpc);
await aid.transfer("RECIPIENT_ADDRESS", BigInt(50), pass);
```

## Key Features

- **Shelter Management**: Deploy and manage shelter contracts
- **Aid Distribution**: Bind and transfer aid with expiration
- **Gate Control**: Open, guard, and seal shelter access
- **Steward Operations**: Update stewards and withdraw funds

## Examples

For more comprehensive examples, see the [end-to-end tests](src/tests/e2e/shelter.e2e.test.ts).
