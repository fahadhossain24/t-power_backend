import { Request, Response } from 'express';
import { IProduct } from './product.interface';
import asyncHandler from '../../../shared/asyncHandler';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import ProductServices from './product.services';
import { FileArray } from 'express-fileupload';
import fileUploader from '../../../utils/fileUploader';
import CustomError from '../../errors';
import fileRemover from '../../../utils/fileRemover';
import { generateSlug } from '../../../utils/slugify';
import categoryServices from '../categoryModule/category.services';

class ProductController {
    createProduct = asyncHandler(async (req: Request, res: Response) => {
        const productBody = req.body;
        const result = await ProductServices.createProduct(productBody);
        if (!result) {
            throw new CustomError.BadRequestError('Failed to create product!');
        }

        // Return response on success
        sendResponse<IProduct>(res, {
            statusCode: StatusCodes.CREATED,
            status: 'success',
            message: 'Product created successfully',
            data: result,
        });
    });

    uploadFiles = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const files = req.files;

        const product = await ProductServices.retrieveProductById(id)
        if (!product) {
            throw new CustomError.NotFoundError('Product not found!');
        }

        // Map of allowed file fields and their respective folders
        const fileConfig: Record<string, string> = {
            images: 'images',
            userGuide: 'userGuide',
            installationGuide: 'installationGuide',
            license: 'license',
        };

        const updatePayload: Record<string, any> = {};

        for (const key of Object.keys(fileConfig)) {
            if (files && files[key]) {
                const uploadedFiles: any = await fileUploader(files as FileArray, fileConfig[key], key);
                updatePayload[key] = uploadedFiles;
            }
        }

        if (Object.keys(updatePayload).length === 0) {
            throw new CustomError.BadRequestError('No valid file fields provided!');
        }

        const result = await ProductServices.updateProduct(id, updatePayload);


        sendResponse<IProduct>(res, {
            statusCode: StatusCodes.OK,
            status: 'success',
            message: 'Product files uploaded successfully',
        });
    });


    retrieveAllProducts = asyncHandler(async (req: Request, res: Response) => {
        const {
            search,
            visibility,
            inStock,
            category,
            viewOnRootPage,
            tags,
            minPrice,
            maxPrice,
        } = req.query;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20; // default 20 per page

        // Handle sorting logic
        let sortBy = (req.query.sortBy as string) || 'createdAt';
        let sortOrder: number = req.query.sortOrder === 'desc' ? -1 : 1;

        let categorySlugToId;
        if (category) {
            const categoryBySlug = await categoryServices.retrieveSpecificCategory(category as string);
            if (!categoryBySlug) {
                throw new CustomError.NotFoundError('Category not found!');
            }
            categorySlugToId = categoryBySlug._id;
        }

        const result = await ProductServices.retrieveAllProducts(
            search as string,
            visibility === 'true' ? true : visibility === 'false' ? false : undefined,
            viewOnRootPage === 'true' ? true : viewOnRootPage === 'false' ? false : undefined,
            inStock as 'on' | 'off',
            page,
            limit,
            {
                tags: tags
                    ? Array.isArray(tags)
                        ? (tags as string[])
                        : String(tags).split(',')
                    : undefined,
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                category: categorySlugToId as string,
            },
            sortBy,
            sortOrder
        );

        sendResponse<IProduct[]>(res, {
            statusCode: StatusCodes.OK,
            status: 'success',
            message: 'Products retrieved successfully',
            meta: result.meta,
            data: result.data,
        });
    });



    retrieveSpecificProduct = asyncHandler(async (req: Request, res: Response) => {
        const result = await ProductServices.retrieveSpecificProduct(req.params.slug);
        if (!result) {
            throw new CustomError.NotFoundError('Product not found!');
        }

        sendResponse<IProduct>(res, {
            statusCode: StatusCodes.OK,
            status: 'success',
            message: 'Product retrieved successfully',
            data: result,
        });
    });

    updateSpecificProduct = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const productBody = req.body;

        const existingProduct = await ProductServices.retrieveProductById(id);
        if (!existingProduct) {
            throw new CustomError.NotFoundError('Product not found!');
        }

        if (productBody.name) {
            const slug = generateSlug(productBody.name);
            const productWithSlug: any = await ProductServices.retrieveSpecificProduct(slug);
            if (productWithSlug && productWithSlug._id.toString() !== id) {
                throw new CustomError.BadRequestError('Product with this name already exists!');
            }
            if (existingProduct.slug !== slug) {
                productBody.slug = slug;
            }
        }

        const result = await ProductServices.updateProduct(id, productBody);

        sendResponse<IProduct>(res, {
            statusCode: StatusCodes.OK,
            status: 'success',
            message: 'Product updated successfully',
            data: result,
        });
    });

    deleteSpecificProduct = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        const existingProduct = await ProductServices.retrieveProductById(id);
        if (!existingProduct) {
            throw new CustomError.NotFoundError('Product not found!');
        }

        if (existingProduct.isDeleted) {
            throw new CustomError.BadRequestError('Product already deleted!');
        }

        const result = await ProductServices.deleteProduct(id, existingProduct.slug);

        if (!result?.isModified) {
            throw new CustomError.BadRequestError('Failed to delete product!');
        }

        sendResponse<IProduct>(res, {
            statusCode: StatusCodes.OK,
            status: 'success',
            message: 'Product deleted successfully',
        });
    });
}

export default new ProductController();
