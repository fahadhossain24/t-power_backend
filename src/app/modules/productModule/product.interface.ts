import { Document, Types } from "mongoose";

export interface IProduct extends Document {
    name: string;
    slug: string;
    sku: string;
    categories: Types.ObjectId[];
    images: string[];
    price: number,
    discount: {
        fixedAmount: number,
        percentage: number
    },
    currency: string;
    description: {
        short: string;
        long: string
    }
    specification: [
        {
            key: string;
            value: string
        }
    ],
    userGuide: string;
    installationGuide: string;
    license: string;
    tags: string[];
    viewOnRootPage: boolean;
    visibility: boolean;
    searchPriority: number;
    inStock: string;
    meta: {
        title: string;
        description: string;
    }
    isDeleted: boolean;
    minimumOrderQuantity: number;
    createdAt: Date;
    updatedAt: Date;
}