import { Schema, model } from 'mongoose';

export const OffRampsModel = model(
  'OffRamps',
  new Schema(
    {
			phoneNumber: { type: String, required: true },
      txHash: { type: String, required: true, unique: true },
      provider: { type: String, required: true, index: true },
      cryptoAmount: { type: Number, required: true },
      fiatConversionAmount: { type: Number, required: true },
      fiatTxAmount: { type: Number, required: true },
      fiatCurrency: { type: String, required: true },
      token: { type: String, required: true },
      fee: { type: Number, required: true },
      txReferenceId: { type: String, required: true, unique: true },
    },
    { timestamps: true },
  ),
);
