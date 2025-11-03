import { Document } from "mongoose";

export interface ISoftware extends Document {
    title: string;
    slug: string;
    description: string;
    mockupImage: string;
    playStoreLink: string;
    appStoreLink: string;
    createdAt: Date;
    updatedAt: Date;
}
    
