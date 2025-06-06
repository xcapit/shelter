import { Schema, model } from "mongoose";

export const BeneficiariesModel = model(
  "Beneficiaries",
  new Schema(
    {
      phoneNumber: { type: String, required: true, index: true, unique: true },
      address: { type: String, required: true },
      secret: { type: String, required: true },
      networkProvider: { type: String, required: false },
      countryCode: { type: String, required: false },
      active: { type: Boolean, required: true, default: true }
    },
    { timestamps: true }
  )
);
