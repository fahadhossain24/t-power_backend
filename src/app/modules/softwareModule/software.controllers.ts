import { Request, Response } from "express";
import asyncHandler from "../../../shared/asyncHandler";
import softwareServices from "./software.services";
import CustomError from "../../errors";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import fileUploader from "../../../utils/fileUploader";

const createSoftwareContent = asyncHandler(async (req: Request, res: Response) => {
  const softwareData = req.body;
  const softwareFile = req.files;

  if (!softwareFile) {
    throw new CustomError.BadRequestError('Please upload mockup image!');
  }

  // Check for existing title
  const existingSoftware = await softwareServices.findSoftwareByTitle(softwareData.title);
  if (existingSoftware) {
    throw new CustomError.BadRequestError('Software with this title already exists!');
  }

  // Upload mockup image
  const mockupImageUrl = await fileUploader(softwareFile, 'software', 'mockupImage');
  softwareData.mockupImage = mockupImageUrl

  // Create software
  const newSoftware = await softwareServices.createSoftwareContent(softwareData);

  if (!newSoftware) {
    throw new CustomError.BadRequestError('Failed to create new software!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'Software created successfully!',
    data: newSoftware,
  });
})

const getSoftwareContent = asyncHandler(async (req: Request, res: Response) => {
  const softwareContent = await softwareServices.getSoftwareContent()
  if (softwareContent.length == 0) {
    throw new CustomError.BadRequestError("Failed to get software content!")
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: "success",
    message: "Software content fetched",
    data: softwareContent
  })
})

const updateSpecificSoftwareContent = asyncHandler(async (req: Request, res: Response) => {
  const {id} = req.params;
  const softwareFile = req.files;
  if(!id){
    throw new CustomError.BadRequestError("Please provide software id!")
  }

  if(softwareFile){
    const mockupImageUrl = await fileUploader(softwareFile, 'software', 'mockupImage');
    req.body.mockupImage = mockupImageUrl
  }

  const softwareContent = await softwareServices.updateSoftwareContent(id, req.body)
  if(!softwareContent.modifiedCount){
    throw new CustomError.BadRequestError("Failed to update software content!")
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: "success",
    message: "Software content updated",
  })
})

const deleteSpecificSoftwareContent = asyncHandler(async (req: Request, res: Response) => {
  const {id} = req.params;
  if(!id){
    throw new CustomError.BadRequestError("Please provide software id!")
  }

  const softwareContent = await softwareServices.deleteSoftwareContent(id)
  if(!softwareContent.deletedCount){
    throw new CustomError.BadRequestError("Failed to delete software content!")
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: "success",
    message: "Software content deleted",
  })
})


export default {
  createSoftwareContent,
  getSoftwareContent,
  updateSpecificSoftwareContent,
  deleteSpecificSoftwareContent
}