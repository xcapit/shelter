import { object, string, InferType } from "yup";

export const completeOrderSerializer = object({
  otp: string().required(),
  phoneNumber: string().required(),
});

export type CompleteOrderData = InferType<typeof completeOrderSerializer>;
