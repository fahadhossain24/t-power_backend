import { Document, Types } from "mongoose";

export interface IQuery extends Document {
    queryId: string;
    name: string;
    email: string;
    contact: string;
    businessName?: string;
    productRef: {
        type: Types.ObjectId;
        // quantity: number
    }
    notes?: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}