import { Schema, model } from "mongoose";

export const PhoneNumberUpdatesModel = model(
  "PhoneNumberUpdates",
  new Schema(
    {
      actualPhoneNumber: { type: String, required: true },
      newPhoneNumber: { type: String, required: true },
      otp: { type: String, required: true },
    },
    { timestamps: true }
  )
);
