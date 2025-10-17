import mongoose from "mongoose";
import { IQuery } from "./query.interface";

const querySchema = new mongoose.Schema<IQuery>({
    queryId: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    businessName: String,
    productRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    notes: String,
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const Query = mongoose.model<IQuery>('query', querySchema);

export default Query;
