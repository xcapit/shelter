// TODO:
// import { createPublicClient, http } from 'viem';
// import { Blockchain } from '../../../beneficiaries/models/blockchain/blockchain';
// import { BalanceOf } from '../../../shared/balance-of/balance-of';
// import { Provider } from '../off-ramp-providers/provider.interface';
// import dotenv from 'dotenv';
// import process from 'process';
// import { OffRampDataRepo } from '../off-ramp-data-repo/off-ramp-data-repo.interface';
// import { DefaultOffRampDataRepo } from '../off-ramp-data-repo/default/default-off-ramp-data-repo';

// import createDebug from 'debug';

// const debug = createDebug('app:off-ramp-service');
// dotenv.config();

// const { ALCHEMY_RPC } = process.env;

// export class OffRampService {
//   constructor(
//     private _offRampProvider: Provider,
//     private _alchemyPublicClient: any = createPublicClient({
//       chain: new Blockchain().value(),
//       transport: http(ALCHEMY_RPC),
//     }),
//     private _offRampDataRepo: OffRampDataRepo = new DefaultOffRampDataRepo(),
//   ) {}

//   private async _checkBalance(): Promise<void> {
//     const balance = await new BalanceOf(
//       this._offRampProvider.token(),
//       this._offRampProvider.beneficiary().address(),
//       this._alchemyPublicClient,
//     ).toAmount();
//     if (
//       balance.value() < this._offRampProvider.amount() ||
//       this._offRampProvider.amount() <= 0
//     ) {
//       throw new Error('Invalid amount');
//     }
//   }

//   async process(): Promise<string> {
//     await this._checkBalance();
//     debug('🔁 Starting offramp provider execution');
//     const offRampProviderExecutionStart = Date.now();
//     const offRampResponse = await this._offRampProvider.execute()
//     debug(`✅ Ending offramp provider execution in ${Date.now() - offRampProviderExecutionStart}ms`);
//     const offRampSavingStart = Date.now();
//     await this._offRampDataRepo.save(offRampResponse)
//     debug(`✅ Offramp saving in ${Date.now() - offRampSavingStart}ms`);
//     return offRampResponse.fiatTxAmount.toString();
//   }
// }
