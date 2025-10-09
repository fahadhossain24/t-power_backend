import { Document } from "mongoose";

export interface IScreen extends Document {
    softwareId: string;
    title: string;
    description: string;
    mockupImage: string;
    createdAt: Date;
    updatedAt: Date;
}
    
