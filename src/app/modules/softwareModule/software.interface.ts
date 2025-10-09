import { Document } from "mongoose";

export interface ISoftware extends Document {
    title: string;
    description: string;
    mockupImage: string;
    playStoreLink: string;
    appStoreLink: string;
    createdAt: Date;
    updatedAt: Date;
}
    
