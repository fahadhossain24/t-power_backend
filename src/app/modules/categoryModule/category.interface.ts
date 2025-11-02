import { Document } from "mongoose";

export interface ICategory extends Document {
    name: string;
    slug: string;
    image: string;
    visibility: {
        isActive: boolean,
        navbar: boolean,
        homepage: boolean,
    };
    isDeleted: boolean;
    metaTitle: string;
    metaDescription: string;
    productCount: number;
    createdAt: Date;
    updatedAt: Date;
}