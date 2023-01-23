import { Schema, model, Document } from 'mongoose';

export interface ICashout extends Document {
    user: string;
    userUnilevelPoints: number;
    userRepeatPurchasePoints: number;
    userMobileNo?: string;
    cashoutAmount: number;
    cashoutType: 'unilevel' | 'repeat-purchase';
    status: 'pending' | 'denied' | 'confirmed' | 'paid';
    createdDate: any;
    updatedDate: any;
}

const cashoutSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        userUnilevelPoints: { type: Number, required: true },
        userRepeatPurchasePoints: { type: Number, required: true },
        userMobileNo: { type: Number, default: null },
        cashoutAmount: { type: Number, required: true },
        cashoutType: { type: String, required: true },
        status: { type: String, required: true },
        createdDate: { type: Date, required: true },
        updatedDate: { type: Date, required: true },
    },
    {
        minimize: false,
        timestamps: true,
    }
);

export default model<ICashout>('Cashout', cashoutSchema);
