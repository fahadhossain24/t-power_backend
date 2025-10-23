import { Document } from 'mongoose';

export interface IPortfolio extends Document {
    contentType: string;
    clientName?: string | null;
    review?: string | null;
    clientImg?: string | null;
    videoUrl?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
