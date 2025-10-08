import { Request, Response } from "express";
import asyncHandler from "../../../shared/asyncHandler";
import partnerServices from "./certificate.services";
import CustomError from "../../errors";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import fileUploader from "../../../utils/fileUploader";
import certificateServices from "./certificate.services";

const createCertificate = asyncHandler(async(req: Request, res: Response) => {
    const partnerFile = req.files;
    if(!partnerFile){
        throw new CustomError.BadRequestError("Please upload partner image!")
    }

    // upload partnerfile
    const certificateFile = await fileUploader(partnerFile, 'partner', 'image')

    const certificate = await certificateServices.createCertificate({image: certificateFile as string})
    if(!certificate){
        throw new CustomError.BadRequestError("Failed to create new certificate!")
    }

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        status: "success",
        message: "Partner created",
        data: certificate
    })
})

const getCertificates = asyncHandler(async(req: Request, res: Response) => {
    const certificates = await certificateServices.getCertificates()
    if(!certificates){
        throw new CustomError.BadRequestError("Failed to get certificates!")
    }

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        status: "success",
        message: "Certificates fetched",
        data: certificates
    })
})

const deleteCertificate = asyncHandler(async(req: Request, res: Response) => {
    const {id} = req.params;
    if(!id){
        throw new CustomError.BadRequestError("Please provide certificate id!")
    }
    const certificate = await certificateServices.deleteCertificate(id)
    if(!certificate){
        throw new CustomError.BadRequestError("Failed to delete certificate!")
    }

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        status: "success",
        message: "Certificate deleted",
    })
})

export default {
    createCertificate,
    getCertificates,
    deleteCertificate
}