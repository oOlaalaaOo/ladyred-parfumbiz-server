import { Schema, model, Document } from "mongoose";

export interface IReferralLog extends Document {
  referredUser: string;
  referrerUser: string;
  referralPoints: number;
  referralType: string;
  description?: string;
  createdDate: any;
  updatedDate: any;
}

const referralLogSchema = new Schema(
  {
    referredUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referrerUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referralPoints: { type: Number, default: 0 },
    referralType: { type: String, default: null },
    description: { type: String, default: null },
    createdDate: { type: Date, required: true },
    updatedDate: { type: Date, required: true },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

export default model<IReferralLog>("ReferralLog", referralLogSchema);
