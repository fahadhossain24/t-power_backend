import { Request, Response } from "express";
import asyncHandler from "../../../shared/asyncHandler";
import softwareServices from "../softwareModule/software.services";
import CustomError from "../../errors";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import fileUploader from "../../../utils/fileUploader";
import screenServices from "./screen.services";

const createScreenContent = asyncHandler(async (req: Request, res: Response) => {
  const screenData = req.body;
  const screenFile = req.files;

  if (!screenFile) {
    throw new CustomError.BadRequestError('Please upload mockup image!');
  }

  // Check for existing title
  const existingScreen = await screenServices.findScreenByTitle(screenData.title);
  if (existingScreen) {
    throw new CustomError.BadRequestError('Screen with this title already exists!');
  }

  // Upload mockup image
  const mockupImageUrl = await fileUploader(screenFile, 'screen', 'mockupImage');
  screenData.mockupImage = mockupImageUrl

  // Create software
  const newScreen = await screenServices.createScreenContent(screenData);

  if (!newScreen) {
    throw new CustomError.BadRequestError('Failed to create new screen!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'Screen created successfully!',
    data: newScreen,
  });
})

const getScreenContentBySoftwareId = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new CustomError.BadRequestError("Please provide software id!")
  }
  let screenContent = []
  const retrieveSoftware = await softwareServices.retrieveSpecificSoftwareBySlug(id)
  if (retrieveSoftware) {
    screenContent = await screenServices.getScreenContentBySoftwareId(retrieveSoftware._id as unknown as string)
    if (screenContent.length == 0) {
      throw new CustomError.BadRequestError("Failed to get screen content!")
    }
  } else {
    throw new CustomError.BadRequestError("No Software found")
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: "success",
    message: "Screen content fetched",
    data: screenContent
  })
})

const updateSpecificScreenContent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const screenFile = req.files;
  if (!id) {
    throw new CustomError.BadRequestError("Please provide screen id!")
  }

  if (screenFile) {
    const mockupImageUrl = await fileUploader(screenFile, 'screen', 'mockupImage');
    req.body.mockupImage = mockupImageUrl
  }

  const screenContent = await screenServices.updateScreenContent(id, req.body)
  console.log(screenContent)
  if (!screenContent.modifiedCount) {
    throw new CustomError.BadRequestError("Failed to update screen content!")
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: "success",
    message: "Screen content updated",
  })
})

const deleteSpecificScreenContent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new CustomError.BadRequestError("Please provide screen id!")
  }

  const screenContent = await screenServices.deleteScreenContent(id)
  if (!screenContent.deletedCount) {
    throw new CustomError.BadRequestError("Failed to delete screen content!")
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: "success",
    message: "Screen content deleted",
  })
})


export default {
  createScreenContent,
  getScreenContentBySoftwareId,
  updateSpecificScreenContent,
  deleteSpecificScreenContent
}