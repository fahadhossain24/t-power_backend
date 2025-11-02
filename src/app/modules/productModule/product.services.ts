import Product from './product.model';
import { IProduct } from './product.interface';
import mongoose from 'mongoose';

class ProductService {
    async createProduct(data: IProduct) {
        const product = await Product.create(data);
        return product;
    }

    // async retrieveAllProducts(
    //     search?: string,
    //     visibility?: boolean,
    //     inStock?: 'on' | 'off',
    //     page = 1,
    //     limit = 10,
    //     filters?: {
    //         brand?: string;
    //         optionToView?: string;
    //         tags?: string[];
    //         minPrice?: number;
    //         maxPrice?: number;
    //         category?: string;
    //     },
    //     sortBy?: string,
    //     sortOrder?: number
    // ) {
    //     const skip = (page - 1) * limit;
    //     const pipeline: any[] = [];

    //     // 1. Atlas Full-text Search
    //     if (search) {
    //         pipeline.push({
    //             $search: {
    //                 index: 'product',
    //                 compound: {
    //                     should: [
    //                         {
    //                             autocomplete: {
    //                                 query: search,
    //                                 path: 'name',
    //                                 fuzzy: { maxEdits: 1, prefixLength: 1 },
    //                             },
    //                         },
    //                         {
    //                             autocomplete: {
    //                                 query: search,
    //                                 path: 'description.short',
    //                                 fuzzy: { maxEdits: 1, prefixLength: 1 },
    //                             },
    //                         },
    //                         {
    //                             autocomplete: {
    //                                 query: search,
    //                                 path: 'tags',
    //                                 fuzzy: { maxEdits: 1, prefixLength: 1 },
    //                             },
    //                         },
    //                         {
    //                             autocomplete: {
    //                                 query: search,
    //                                 path: 'slug',
    //                                 fuzzy: { maxEdits: 1, prefixLength: 1 },
    //                             },
    //                         },
    //                     ],
    //                 },
    //             },
    //         });
    //     }

    //     // 2. Match Stage
    //     const matchStage: any = { isDeleted: false };

    //     if (visibility !== undefined) matchStage.visibility = visibility;

    //     if (inStock) matchStage.inStock = inStock;

    //     if (filters?.brand) matchStage.brand = filters.brand;

    //     if (filters?.optionToView) {
    //         matchStage.optionToView = { $in: [filters.optionToView] };
    //     }

    //     if (filters?.tags && filters.tags.length > 0)
    //         matchStage.tags = { $in: filters.tags };

    //     if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
    //         matchStage.price = {};
    //         if (filters.minPrice !== undefined) matchStage.price.$gte = filters.minPrice;
    //         if (filters.maxPrice !== undefined) matchStage.price.$lte = filters.maxPrice;
    //     }

    //     if (filters?.category && mongoose.Types.ObjectId.isValid(filters.category)) {
    //         matchStage.categories = { $in: [new mongoose.Types.ObjectId(filters.category)] };
    //     }

    //     pipeline.push({ $match: matchStage });

    //     pipeline.push({ $sort: { [sortBy as string]: sortOrder } });

    //     // 3. Sort, Paginate
    //     pipeline.push(
    //         { $skip: skip },
    //         { $limit: limit }
    //     );

    //     // 4. Populate Categories
    //     pipeline.push({
    //         $lookup: {
    //             from: 'categories',
    //             localField: 'categories',
    //             foreignField: '_id',
    //             as: 'categories',
    //         },
    //     });

    //     const data = await Product.aggregate(pipeline);
    //     const totalData = await Product.countDocuments(matchStage);

    //     return {
    //         meta: {
    //             currentPage: page,
    //             limit,
    //             totalPage: Math.ceil(totalData / limit),
    //             totalData,
    //         },
    //         data,
    //     };
    // }

    async retrieveAllProducts(
        search?: string,
        visibility?: boolean,
        viewOnRootPage?: boolean,
        inStock?: 'on' | 'off',
        page = 1,
        limit = 20,
        filters?: {
            tags?: string[];
            minPrice?: number;
            maxPrice?: number;
            category?: string;
            spec?: string;
        },
        sortBy: string = 'createdAt',
        sortOrder: number = -1
    ) {
        const skip = (page - 1) * limit;
        const pipeline: any[] = [];

        /** -------------------------
         * 1. Atlas Full-text Search
         * -------------------------- */
        if (search) {
            pipeline.push({
                $search: {
                    index: 'product',
                    compound: {
                        should: [
                            {
                                autocomplete: {
                                    query: search,
                                    path: 'name',
                                    fuzzy: { maxEdits: 1, prefixLength: 1 },
                                },
                            },
                            {
                                autocomplete: {
                                    query: search,
                                    path: 'description.short',
                                    fuzzy: { maxEdits: 1, prefixLength: 1 },
                                },
                            },
                            {
                                autocomplete: {
                                    query: search,
                                    path: 'tags',
                                    fuzzy: { maxEdits: 1, prefixLength: 1 },
                                },
                            },
                            {
                                autocomplete: {
                                    query: search,
                                    path: 'slug',
                                    fuzzy: { maxEdits: 1, prefixLength: 1 },
                                },
                            },
                        ],
                    },
                },
            });
        }

        /** -------------------------
         * 2. Match Stage (filters)
         * -------------------------- */
        const matchStage: any = { isDeleted: false };

        if (visibility !== undefined) matchStage.visibility = visibility;
        if (viewOnRootPage !== undefined) matchStage.viewOnRootPage = viewOnRootPage;
        if (inStock) matchStage.inStock = inStock;

        // Tags filter
        if (filters?.tags?.length) matchStage.tags = { $in: filters.tags };

        // Price range
        if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
            matchStage.price = {};
            if (filters.minPrice !== undefined) matchStage.price.$gte = filters.minPrice;
            if (filters.maxPrice !== undefined) matchStage.price.$lte = filters.maxPrice;
        }

        // Category filter
        if (filters?.category && mongoose.Types.ObjectId.isValid(filters.category)) {
            matchStage.categories = { $in: [new mongoose.Types.ObjectId(filters.category)] };
        }

        if (filters?.spec) {
            const regex = new RegExp(filters.spec, 'i'); // case-insensitive regex
            matchStage.$or = [
                { 'specification.value': regex },
                { 'specification.key': regex }
            ];
        }

        pipeline.push({ $match: matchStage });

        /** -------------------------
         * 3. Sorting Logic
         * -------------------------- */
        const sortStage: Record<string, number> = {};

        // Primary rule: search results should respect searchPriority first
        sortStage.searchPriority = -1;

        // Handle A–Z or Z–A cases
        if (sortBy === 'name' && (sortOrder === 1 || sortOrder === -1)) {
            sortStage.name = sortOrder;
        } else {
            // Default custom sorting
            sortStage[sortBy] = sortOrder;
        }

        pipeline.push({ $sort: sortStage });

        /** -------------------------
         * 4. Pagination
         * -------------------------- */
        pipeline.push({ $skip: skip }, { $limit: limit });

        /** -------------------------
         * 5. Lookup Categories
         * -------------------------- */
        pipeline.push({
            $lookup: {
                from: 'categories',
                localField: 'categories',
                foreignField: '_id',
                as: 'categories',
            },
        });
        //     {
        //         $lookup: {
        //             from: 'ratings',
        //             let: { productId: '$_id' },
        //             pipeline: [
        //                 { $match: { $expr: { $eq: ['$productId', '$$productId'] } } },
        //                 {
        //                     $group: {
        //                         _id: null,
        //                         averageRating: { $avg: '$rating' },
        //                         totalRatingCount: { $sum: 1 },
        //                     },
        //                 },
        //             ],
        //             as: 'ratingStats',
        //         },
        //     },
        //     {
        //         $addFields: {
        //             averageRating: {
        //                 $ifNull: [{ $arrayElemAt: ['$ratingStats.averageRating', 0] }, 0],
        //             },
        //             totalRatingCount: {
        //                 $ifNull: [{ $arrayElemAt: ['$ratingStats.totalRatingCount', 0] }, 0],
        //             },
        //         },
        //     },
        //     {
        //         $project: { ratingStats: 0 },
        //     }
        // );

        /** -------------------------
         * 7. Execute and count
         * -------------------------- */
        const data = await Product.aggregate(pipeline);
        const totalData = await Product.countDocuments(matchStage);

        return {
            meta: {
                currentPage: page,
                limit,
                totalPage: Math.ceil(totalData / limit),
                totalData,
            },
            data,
        };
    }

    async retrieveProductById(id: string) {
        return await Product.findById(id).populate('categories');
    }
    async retrieveSpecificProductById(id: string) {
        return await Product.findById(id);
    }

    async retrieveSpecificProduct(slug: string) {
        return await Product.findOne({ slug }).populate('categories');
    }

    async updateProduct(id: string, data: Partial<IProduct>) {
        return await Product.findByIdAndUpdate(id, data, { new: true }).populate('categories');
    }

    async deleteProduct(id: string, oldSlug: string) {
        return await Product.findByIdAndUpdate(id, { isDeleted: true, visibility: false, slug: `${oldSlug}-deleted-${Date.now()}` }, { new: true });
    }

}

export default new ProductService();
