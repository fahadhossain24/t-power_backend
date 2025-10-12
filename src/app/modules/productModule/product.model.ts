import mongoose from "mongoose";
import { IProduct } from "./product.interface";
import { ENUM_CURRENCY } from "../../../enums/currency";

const productSchema = new mongoose.Schema<IProduct>({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sku: {
        type: String,
        required: true
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    }],
    images: [String],
    price: Number,
    discount: {
        fixedAmount: Number,
        percentage: Number
    },
    currency: {
        type: String,
        enum: Object.values(ENUM_CURRENCY),
        default: ENUM_CURRENCY.GBP
    },
    description: {
        short: String,
        long: String
    },
    specification: [
        {
            key: String,
            value: String
        }
    ],
    userGuide: {
        type: String,
        default: null
    },
    installationGuide: {
        type: String,
        default: null
    },
    license: {
        type: String,
        default: null
    },
    tags: [String],
    viewOnRootPage: {
        type: Boolean,
        required: true
    },
    visibility: {
        type: Boolean,
        required: true
    },
    searchPriority: {
        type: Number,
        default: 5
    },
    inStock: {
        type: String,
        enum: ['on', 'off'],
        default: 'on'
    },
    meta: {
        title: String,
        description: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    minimumOrderQuantity: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
})

const Product = mongoose.model<IProduct>("product", productSchema)

export default Product