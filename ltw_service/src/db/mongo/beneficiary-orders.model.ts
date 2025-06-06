import { Schema, model } from "mongoose";

export const BeneficiaryOrdersModel = model(
  "BeneficiaryOrders",
  new Schema({
    phoneNumber: { type: String, required: true },
    merchAddress: { type: String, required: true },
    otp: { type: String, required: true },
    token: { type: String, required: true },
    amount: { type: String, required: true },
    success: { type: Boolean, default: false },
    description: { type: String },
    expirationDate: { type: Number, required: true },
  },
  { timestamps: true })
);
