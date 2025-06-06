import { connect } from "mongoose";
import dotenv from "dotenv";
import process from "process";

dotenv.config();

const { DB_USER, DB_PASS, DB_NAME } = process.env;

export const connectDb = (): Promise<any> => {
  return connect(`mongodb://${DB_USER}:${DB_PASS}@ferretdb:27017/${DB_NAME}`)
    .then(() => {
      console.log("mongo db connected...");
    })
    .catch((err) => console.log("Error:", err));
};
