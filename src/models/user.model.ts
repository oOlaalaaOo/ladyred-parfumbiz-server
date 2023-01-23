import { Schema, model, Document, HookNextFunction } from 'mongoose';
import bcryptService from '../services/bcrypt.service';

export interface IUser extends Document {
    name: string;
    username: string;
    password: string;
    uniqueCode: string;
    referralCode: string;
    unilevelPoints: number;
    repeatPurchasePoints: number;
    btcWallet?: string;
    tbcWallet?: string;
    mobileNo?: string;
    isActive: boolean;
    createdDate: any;
    updatedDate: any;
}

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        username: { type: String, required: true, select: false },
        password: { type: String, required: true, select: false },
        uniqueCode: { type: String, required: true },
        referralCode: { type: String, required: true },
        unilevelPoints: { type: Number, default: 0 },
        repeatPurchasePoints: { type: Number, default: 0 },
        btcWallet: { type: String, default: null },
        tbcWallet: { type: String, default: null },
        mobileNo: { type: String, default: null },
        isActive: { type: Boolean, default: true },
        createdDate: { type: Date, required: true },
        updatedDate: { type: Date, required: true },
    },
    {
        minimize: false,
        timestamps: true,
    }
);

userSchema.pre<IUser>('save', function (next: HookNextFunction) {
    if (!this.isModified('password')) return next();

    try {
        this.password = bcryptService.hashString(this.password);

        return next();
    } catch (err) {
        return next(err);
    }
});

export default model<IUser>('User', userSchema);
