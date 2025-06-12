import express, { Express, NextFunction, Request, Response } from 'express';
import { connectDb } from './db/connection';
import dotenv from 'dotenv';
import process from 'process';
import bodyParser from 'body-parser';
import { Users } from './users/models/users/users';
import { Beneficiaries } from './beneficiaries/models/beneficiaries/beneficiaries';
import { Orders } from './orders/models/orders/orders';
import { LowTechServer } from './low-tech-server';
import { DeployedShelter, Rpc, ShelterClient } from '@xcapit/shelter-sdk';
import { Keypair, rpc as stellarRpc } from '@stellar/stellar-sdk';

dotenv.config();

const { APP_PORT, SHELTER_ID, STEWARD_SECRET, STELLAR_RPC } = process.env;

connectDb().then(async () => {
  const app: Express = express();

  const port = APP_PORT || 3000;

  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  const stewardKeypair = Keypair.fromSecret(STEWARD_SECRET!);
  const rpc = new Rpc(new stellarRpc.Server(STELLAR_RPC!));
  new LowTechServer(
    app,
    new Beneficiaries(),
    new Orders(),
    new Users(),
    new DeployedShelter(
      stewardKeypair,
      rpc,
      new ShelterClient({
        contractId: SHELTER_ID!,
        networkPassphrase: await rpc.network(),
        rpcUrl: rpc.url(),
        publicKey: stewardKeypair.publicKey(),
      }),
    ),
  ).register();

  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(
      `[${new Date().toISOString()}] - ERROR: ${req.method} on ${req.originalUrl};`,
      err,
    );
    next(err);
  });

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(400).send({ error: err?.message });
  });

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
});
