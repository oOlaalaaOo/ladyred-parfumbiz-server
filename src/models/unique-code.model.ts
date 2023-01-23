import { Schema, model, Document } from 'mongoose';

export interface IUniqueCode extends Document {
    code: string;
    status: string; // taken, available
    createdDate: any;
    updatedDate: any;
}

const uniqueCodeSchema = new Schema(
    {
        code: { type: String, required: true },
        status: { type: String, required: true },
        createdDate: { type: Date, required: true },
        updatedDate: { type: Date, required: true },
    },
    {
        minimize: false,
        timestamps: true,
    }
);

export default model<IUniqueCode>('UniqueCode', uniqueCodeSchema);
