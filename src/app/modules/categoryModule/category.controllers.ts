import { Request, Response } from 'express';
import { ICategory } from './category.interface';
import asyncHandler from '../../../shared/asyncHandler';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import CategoryServices from './category.services';
import { FileArray } from 'express-fileupload';
import fileUploader from '../../../utils/fileUploader';
import CustomError from '../../errors';
import IdGenerator from '../../../utils/IdGenerator';
import categoryServices from './category.services';
import config from '../../../config';
import fileRemover from '../../../utils/fileRemover';
import { generateSlug } from '../../../utils/slugify';

class CategoryController {
  createCategory = asyncHandler(async (req: Request, res: Response) => {
    const categoryBody = req.body
    const files = req.files

    const visibility = {
      isActive: req.body.isActive === 'true',
      navbar: req.body.navbar === 'true',
      homepage: req.body.homepage === 'true',
    }

    categoryBody.visibility = visibility;

    if (files && files.image) {
      const imagePath = await fileUploader(files as FileArray, `${categoryBody.name}-image`, 'image');
      // console.log(imagePath)
      categoryBody.image = imagePath;
    } else {
      throw new CustomError.BadRequestError('Image is required!')
    }

    const result = await CategoryServices.createCategory(categoryBody);

    if (!result) {
      throw new CustomError.BadRequestError('Failed to create category!');
    }
    sendResponse<ICategory>(res, {
      statusCode: StatusCodes.CREATED,
      status: 'success',
      message: 'Category created successfully',
      data: result,
    });
  });

  retrieveAllCategory = asyncHandler(async (req: Request, res: Response) => {
    const { search, page = "1", limit = "10", ...visibilityFilters } = req.query;

  const parsedPage = Number(page) || 1;
  const parsedLimit = Number(limit) || 10;

    const parsedVisibility: Record<string, boolean> = {};
    for (const [key, value] of Object.entries(visibilityFilters)) {
      parsedVisibility[key] = value === "true";
    }
    console.log(search)
    const result = await CategoryServices.retrieveAllCategory(search as string, parsedVisibility, parsedPage, parsedLimit);

    sendResponse<ICategory[]>(res, {
      statusCode: 200,
      status: 'success',
      message: 'Categories retrieved successfully',
      meta: result.meta,
      data: result.data,
    });
  });

  retrieveSpecificCategory = asyncHandler(async (req: Request, res: Response) => {
    const result = await CategoryServices.retrieveSpecificCategory(req.params.slug);
    // console.log(result)
    if (!result) {
      throw new CustomError.BadRequestError("No category found!")
    }
    sendResponse<ICategory>(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Category retrieved successfully',
      data: result
    });
  });

  updateSpecificCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const categoryBody = req.body
    const files = req.files

    categoryBody.visibility = req.body.visibility === 'true';

    const category = await CategoryServices.retrieveSpecificCategoryById(id);
    if (!category) {
      throw new CustomError.NotFoundError('Category not found!');
    }

    if (files && files.image) {
      if (category.image) {
        await fileRemover(category.image);
      }
      const imagePath = await fileUploader(files as FileArray, `${categoryBody ? categoryBody.name : category.name}-image`, 'image');
      console.log(imagePath)
      categoryBody.image = imagePath;
    }

    // if (categoryBody.name) {
    //   const slug = generateSlug(categoryBody.name);
    //   const categoryWithSlug: any = await CategoryServices.retrieveSpecificCategory(slug);
    //   if (categoryWithSlug && categoryWithSlug._id.toString() !== id) {
    //     throw new CustomError.BadRequestError('Category with this name already exists!');
    //   }
    //   if (category.slug !== slug) {
    //     categoryBody.slug = slug;
    //   }
    // }

    const result = await CategoryServices.updateSpecificCategory(id, categoryBody);
    sendResponse<ICategory>(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Category updated successfully',
      // data: result,
    });
  });

  deleteSpecificCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await CategoryServices.retrieveSpecificCategoryById(id)
    if (!category) {
      throw new CustomError.NotFoundError('Category not found!');
    }

    if (category.isDeleted) {
      throw new CustomError.BadRequestError('Category already deleted!');
    }

    const result = await CategoryServices.deleteSpecificCategory(id, category.slug);

    if (!result?.isModified) {
      throw new CustomError.BadRequestError('Failed to delete category!');
    }
    sendResponse<ICategory>(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Category deleted successfully',
      // data: result,
    });
  });

  retrieveCategoriesWithSomeProducts = asyncHandler(async (req: Request, res: Response) => {
    const { count } = req.query
    if(!Number(count)){
      throw new CustomError.BadRequestError("Count must need!")
    }
    const productsWithCategory = await categoryServices.retrieveCategoriesWithSomeProducts(Number(count))

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Retrieve Categories with products successfully',
      data: productsWithCategory,
    })
  })
}

export default new CategoryController();
