import { Request, Response } from 'express';
import ContactUs from './contactUs.model';
import CustomError from '../../errors';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import asyncHandler from '../../../shared/asyncHandler';
import fileUploader from '../../../utils/fileUploader';
import { FileArray } from 'express-fileupload';

// Controller to create or update About Us content
const createContactUs = asyncHandler(async (req: Request, res: Response) => {
  const aboutData = req.body;
  const files = req.files;

  let createdContent, updatedContent;

  const existingContactUs = await ContactUs.findOne()

  if (files) {
    const image = await fileUploader(files as FileArray, `${aboutData.type}-attachment-${Date.now()}`, 'image');
    aboutData.image = image;
  }

  if (existingContactUs) {
    updatedContent = await ContactUs.findByIdAndUpdate(existingContactUs._id, aboutData);
  } else {
    createdContent = await ContactUs.create(aboutData);
  }

  if (createdContent) {
    return sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      status: 'success',
      message: 'Contact Us created successfully',
      data: createdContent
    });
  }

  if (updatedContent) {
    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Contact Us updated successfully',
      data: updatedContent
    });
  }


}
);

// Controller to get About Us content
const getContactUs = asyncHandler(async (req: Request, res: Response) => {
  const aboutUs = await ContactUs.findOne();

  if (!aboutUs) {
    throw new CustomError.NotFoundError('No Contact Us found!');
  }

  return sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Contact Us content retrieved successfully',
    data: aboutUs,
  });
});

export default {
  createContactUs,
  getContactUs,
};
