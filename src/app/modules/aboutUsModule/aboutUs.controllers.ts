import { Request, Response } from 'express';
import AboutUs from './aboutUs.model';
import CustomError from '../../errors';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import asyncHandler from '../../../shared/asyncHandler';
import fileUploader from '../../../utils/fileUploader';
import { FileArray } from 'express-fileupload';
import slugify from 'slugify';

// Controller to create or update About Us content
const createAbout = asyncHandler(async (req: Request, res: Response) => {
  const aboutData = req.body;
  const files = req.files;

  if (!aboutData.contentType) {
    throw new CustomError.BadRequestError("Content type is required")
  }

  if (!files) {
    throw new CustomError.BadRequestError("Image file is required")
  }

  if (aboutData.contentType !== 'about_us' && aboutData.contentType !== 'mission' && aboutData.contentType !== 'vision') {
    throw new CustomError.BadRequestError("Invalid content type")
  }

  if (aboutData.contentType === 'about_us' && !files?.imgUrl_2) {
    throw new CustomError.BadRequestError("Second image is required")
  }

  let createdContent, updatedContent;

  switch (aboutData.contentType) {
    case 'about_us':
      if (files && files.imgUrl_1) {
        const images = await fileUploader(files as FileArray, `${aboutData.type}-attachment-${Date.now()}`, 'imgUrl_1');
        aboutData.imgUrl_1 = images
      }

      if (files && files.imgUrl_2) {
        const images = await fileUploader(files as FileArray, `${aboutData.type}-attachment-${Date.now()}`, 'imgUrl_2');
        aboutData.imgUrl_2 = images
      }

      const existingAbout = await AboutUs.findOne({ contentType: 'about_us' });
      if (existingAbout) {
        updatedContent = await AboutUs.findByIdAndUpdate(existingAbout._id, aboutData);
      } else {
        createdContent = await AboutUs.create(aboutData);
      }

      break;
    case 'mission':
      if (files && files.imgUrl_1) {
        const images = await fileUploader(files as FileArray, `${aboutData.type}-attachment-${Date.now()}`, 'imgUrl_1');
        aboutData.imgUrl_1 = images
      }

      const existingMission = await AboutUs.findOne({ contentType: 'mission' });
      if (existingMission) {
        updatedContent = await AboutUs.findByIdAndUpdate(existingMission._id, aboutData);
      } else {
        createdContent = await AboutUs.create(aboutData);
      }
      break;
    case 'vision':
      if (files && files.imgUrl_1) {
        const images = await fileUploader(files as FileArray, `${aboutData.type}-attachment-${Date.now()}`, 'imgUrl_1');
        aboutData.imgUrl_1 = images
      }

      const existingVision = await AboutUs.findOne({ contentType: 'vision' });
      if (existingVision) {
        updatedContent = await AboutUs.findByIdAndUpdate(existingVision._id, aboutData);
      } else {
        createdContent = await AboutUs.create(aboutData);
      }
      break;
    default:
      break;
  }

  if (createdContent) {
    return sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      status: 'success',
      message: 'About created successfully',
      data: createdContent
    });
  }

  if(updatedContent){
    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'About updated successfully',
      data: updatedContent
    });
  }


}
);

// const updateAbout = asyncHandler(async (req: Request, res: Response) => {
//   const {id} = req.params
//   const aboutData = req.body;
//   const files = req.files;

//   if(aboutData.slug){
//     const slug = slugify(aboutData.slug);
//     aboutData.slug = slug;
//   }

//   if(files && files.images){
//     const images = await fileUploader(files as FileArray, `${aboutData.type}-attachment-${Date.now()}`, 'images');
//     aboutData.images = images;
//   }

//   // Create a new About Us record
//   const newAboutUs = await AboutUs.findByIdAndUpdate(id, aboutData, {new: true});

//   if (!newAboutUs?.isModified) {
//     throw new CustomError.BadRequestError('Failed to update About Us');
//   }

//   return sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     status: 'success',
//     message: 'About updated successfully',
//   });
// })

// Controller to get About Us content
const getAboutUs = asyncHandler(async (req: Request, res: Response) => {
  const aboutUs = await AboutUs.find();

  if (aboutUs.length == 0) {
    throw new CustomError.NotFoundError('No About Us found!');
  }

  return sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'About Us content retrieved successfully',
    data: aboutUs,
  });
});

export default {
  createAbout,
  getAboutUs,
};
