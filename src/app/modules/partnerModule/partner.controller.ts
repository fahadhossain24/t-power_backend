import { Request, Response } from "express";
import asyncHandler from "../../../shared/asyncHandler";
import partnerServices from "./partner.services";
import CustomError from "../../errors";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import fileUploader from "../../../utils/fileUploader";

const createPartner = asyncHandler(async(req: Request, res: Response) => {
    const partnerFile = req.files;
    if(!partnerFile){
        throw new CustomError.BadRequestError("Please upload partner image!")
    }

    // upload partnerfile
    const partnerFileUrl = await fileUploader(partnerFile, 'partner', 'image')

    const partner = await partnerServices.createPartner({image: partnerFileUrl as string})
    if(!partner){
        throw new CustomError.BadRequestError("Failed to create new partner!")
    }

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        status: "success",
        message: "Partner created",
    })
})

const getPartners = asyncHandler(async(req: Request, res: Response) => {
    const partners = await partnerServices.getPartners()
    if(!partners){
        throw new CustomError.BadRequestError("Failed to get partners!")
    }

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        status: "success",
        message: "Partners fetched",
        data: partners
    })
})

const deletePartner = asyncHandler(async(req: Request, res: Response) => {
    const {id} = req.params;
    if(!id){
        throw new CustomError.BadRequestError("Please provide partner id!")
    }
    const partner = await partnerServices.deletePartner(id)
    if(!partner){
        throw new CustomError.BadRequestError("Failed to delete partner!")
    }

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        status: "success",
        message: "Partner deleted",
    })
})

export default {
    createPartner,
    getPartners,
    deletePartner
}