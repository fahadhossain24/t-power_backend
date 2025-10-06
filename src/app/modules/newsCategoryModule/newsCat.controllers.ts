import { Request, Response } from "express";
import asyncHandler from "../../../shared/asyncHandler";
import newsCatService from "./newsCat.service";

// const createNewsCategory = asyncHandler(async (req: Request, res: Response) => {
//     const newsCategoryData = req.body;
//     const newsCategory = await newsCatService.createNewsCategory(newsCategoryData);
//     if (!newsCategory) {
//         throw new Error("Failed to create news category!")
//     }
//     res.status(201).json({
//         success: true,
//         message: "News Category created successfully",
//         data: newsCategory
//     })
// })

const retrieveAllNewsCategory = asyncHandler(async (req: Request, res: Response) => {
    const newsCategories = await newsCatService.getNewsCategory()
    if (!newsCategories) {
        throw new Error("Failed to retrieve news categories!")
    }
    res.status(200).json({
        success: true,
        message: "News Categories retrieved successfully",
        data: newsCategories
    })
})

const deleteSpecificCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedCategory = await newsCatService.deleteNewsCategory(id);
    if (!deletedCategory?.deletedCount) {
        throw new Error("Failed to delete news category!")
    }
    res.status(200).json({
        success: true,
        message: "News Category deleted successfully",
    })
})

export default {
    // createNewsCategory,
    retrieveAllNewsCategory,
    deleteSpecificCategory
}