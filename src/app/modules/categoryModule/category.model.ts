import mongoose from "mongoose";
import { ICategory } from "./category.interface";

const categorySchema = new mongoose.Schema<ICategory>({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    metaTitle: {
        type: String,
        required: true,
    },
    metaDescription: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    visibility: {
        isActive: {
            type: Boolean,
            default: true,
        },
        navbar: {
            type: Boolean,
            default: true,
        },
        homepage: {
            type: Boolean,
            default: true,
        },
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
})

categorySchema.index({ name: 'text', description: 'text', slug: 'text' });

const Category = mongoose.model<ICategory>("category", categorySchema)

export default Category
