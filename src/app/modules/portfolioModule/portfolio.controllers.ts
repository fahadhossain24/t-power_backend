import { Request, Response } from "express";
import CustomError from "../../errors";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import fileUploader from "../../../utils/fileUploader";
import portfolioServices from "./portfolio.services";
import asyncHandler from "../../../shared/asyncHandler";

const createPortfolio = asyncHandler(async(req: Request, res: Response) => {
    const portfolioBody = req.body;
    const files = req.files;

    if(portfolioBody.contentType === 'review'){
        if(files){
            portfolioBody.clientImg = await fileUploader(files, 'portfolio', 'clientImg')
        }

    }
    
    const portfolio = await portfolioServices.createPortfolio(portfolioBody)
    if(!portfolio){
        throw new CustomError.BadRequestError("Failed to create portfolio!")
    }

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        status: "success",
        message: "Portfolio created",
        data: portfolio
    })
})

const getPortfolio = asyncHandler(async(req: Request, res: Response) => {
    const portfolios = await portfolioServices.getPortfolio()
    if(portfolios.length === 0){
        throw new CustomError.BadRequestError("Failed to get portfolio!")
    }

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        status: "success",
        message: "Portfolio fetched",
        data: portfolios
    })
})

const deletePortfolio = asyncHandler(async(req: Request, res: Response) => {
    const {id} = req.params;
    if(!id){
        throw new CustomError.BadRequestError("Please provide portfolio id!")
    }
    const portfolio = await portfolioServices.deletePortfolio(id)
    if(!portfolio){
        throw new CustomError.BadRequestError("Failed to delete portfolio!")
    }

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        status: "success",
        message: "Portfolio deleted",
    })
})

export default {
    createPortfolio,
    getPortfolio,
    deletePortfolio
}