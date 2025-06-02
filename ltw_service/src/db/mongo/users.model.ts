import { Schema, model } from "mongoose";

export const UsersModel = model(
    "Users",
    new Schema(
        {
            username: { type: String, required: true, index: true, unique: true },
            role: { type: String, required: true},
            password: { type: String, required: true },
            active: { type: Boolean, default: false },
        },
        { timestamps: true }
    )
);
