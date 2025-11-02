import { Document, Types } from "mongoose";

export interface IScreen extends Document {
    softwareId: Types.ObjectId;
    title: string;
    description: string;
    mockupImage: string;
    createdAt: Date;
    updatedAt: Date;
}
    
