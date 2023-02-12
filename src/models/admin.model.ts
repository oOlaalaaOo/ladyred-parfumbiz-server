import { Schema, model, Document, HookNextFunction } from 'mongoose';
import { validAlpha } from '../helpers/validator.helper';
import bcryptService from '../services/bcrypt.service';

export interface IAdmin extends Document {
    name: string;
    username: string;
    password: string;
    createdDate: any;
    updatedDate: any;
}

const adminSchema = new Schema(
    {
        name: { type: String, required: true, validate: validAlpha },
        username: { type: String, required: true },
        password: { type: String, required: true, select: false },
        createdDate: { type: Date, required: true },
        updatedDate: { type: Date, required: true },
    },
    {
        minimize: false,
        timestamps: true,
    }
);

adminSchema.pre<IAdmin>('save', async function (next: HookNextFunction) {
    if (!this.isModified('password')) return next();

    try {
        this.password = await bcryptService.hashString(this.password);

        return next();
    } catch (err) {
        return next(err);
    }
});

export default model<IAdmin>('Admin', adminSchema);
