import { Request, Response } from 'express';
import Hero from './hero.model';
import CustomError from '../../errors';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import asyncHandler from '../../../shared/asyncHandler';
import fileUploader from '../../../utils/fileUploader';
import { FileArray } from 'express-fileupload';

// Controller to create or update About Us content
const createHero = asyncHandler(async (req: Request, res: Response) => {
  const heroData = req.body;
  const files = req.files;

  if (!heroData.heroType) {
    throw new CustomError.BadRequestError("Hero type is required")
  }

  // if (!files) {
  //   throw new CustomError.BadRequestError("Image file is required")
  // }

  if (heroData.heroType !== 'slide' && heroData.heroType !== 'landing' && heroData.heroType !== 'ev_charger' && heroData.heroType !== 'kehua_inverter' && heroData.heroType !== 'energy_storage' && heroData.heroType !== 'about_us' && heroData.heroType !== 'contact_us' && heroData.heroType !== 'software' && heroData.heroType !== 'news') {
    throw new CustomError.BadRequestError("Invalid hero type")
  }

  let createdContent, updatedContent;

  switch (heroData.heroType) {
    case 'slide':
      const existingHero = await Hero.findOne({ heroType: 'slide' });
      if (existingHero) {
        if (files && files.multipleHeroImages) {
          const images = await fileUploader(files as FileArray, `${heroData.heroType}-attachment-${Date.now()}`, 'multipleHeroImages');
          heroData.multipleHeroImages = images
        }
        updatedContent = await Hero.findByIdAndUpdate(existingHero._id, heroData);
      } else {
        if (files && files?.multipleHeroImages) {
          const images = await fileUploader(files as FileArray, `${heroData.heroType}-attachment-${Date.now()}`, 'multipleHeroImages');
          heroData.multipleHeroImages = images
        } else {
          throw new CustomError.BadRequestError("Hero images are required for slide")
        }
        createdContent = await Hero.create(heroData);
      }

      break;
    case 'landing':
      const existingMission = await Hero.findOne({ heroType: 'landing' });
      if (existingMission) {
        if (files && files.singleHeroImage) {
          const images = await fileUploader(files as FileArray, `${heroData.heroType}-attachment-${Date.now()}`, 'singleHeroImage');
          heroData.singleHeroImage = images
        }
        updatedContent = await Hero.findByIdAndUpdate(existingMission._id, heroData);
      } else {
        if (files && files?.singleHeroImage) {
          const images = await fileUploader(files as FileArray, `${heroData.heroType}-attachment-${Date.now()}`, 'singleHeroImage');
          heroData.singleHeroImage = images
        } else {
          throw new CustomError.BadRequestError("Hero images are required for landing")
        }
        createdContent = await Hero.create(heroData);
      }
      break;
    case 'ev_charger':
      const existingEvCharger = await Hero.findOne({ heroType: 'ev_charger' });
      if (existingEvCharger) {
        if (files && files.singleHeroImage) {
          const images = await fileUploader(files as FileArray, `${heroData.heroType}-attachment-${Date.now()}`, 'singleHeroImage');
          heroData.singleHeroImage = images
        }
        updatedContent = await Hero.findByIdAndUpdate(existingEvCharger._id, heroData);
      } else {
        if (files && files?.singleHeroImage) {
          const images = await fileUploader(files as FileArray, `${heroData.heroType}-attachment-${Date.now()}`, 'singleHeroImage');
          heroData.singleHeroImage = images
        } else {
          throw new CustomError.BadRequestError("Hero images are required for ev_charger")
        }
        createdContent = await Hero.create(heroData);
      }
      break;
    case 'kehua_inverter':
      const existingKehuaInverter = await Hero.findOne({ heroType: 'kehua_inverter' });
      if (existingKehuaInverter) {
        if (files && files.singleHeroImage) {
          const images = await fileUploader(files as FileArray, `${heroData.heroType}-attachment-${Date.now()}`, 'singleHeroImage');
          heroData.singleHeroImage = images
        }
        updatedContent = await Hero.findByIdAndUpdate(existingKehuaInverter._id, heroData);
      } else {
        if (files && files?.singleHeroImage) {
          const images = await fileUploader(files as FileArray, `${heroData.heroType}-attachment-${Date.now()}`, 'singleHeroImage');
          heroData.singleHeroImage = images
        } else {
          throw new CustomError.BadRequestError("Hero images are required for ev_charger")
        }
        createdContent = await Hero.create(heroData);
      }
      break;
    case 'energy_storage':
      const existingEnergyStorage = await Hero.findOne({ heroType: 'energy_storage' });
      if (existingEnergyStorage) {
        if (files && files.singleHeroImage) {
          const images = await fileUploader(files as FileArray, `${heroData.heroType}-attachment-${Date.now()}`, 'singleHeroImage');
          heroData.singleHeroImage = images
        }
        updatedContent = await Hero.findByIdAndUpdate(existingEnergyStorage._id, heroData);
      } else {
        if (files && files?.singleHeroImage) {
          const images = await fileUploader(files as FileArray, `${heroData.heroType}-attachment-${Date.now()}`, 'singleHeroImage');
          heroData.singleHeroImage = images
        } else {
          throw new CustomError.BadRequestError("Hero images are required for ev_charger")
        }
        createdContent = await Hero.create(heroData);
      }
      break;
    case 'about_us':
      const existingAboutUs = await Hero.findOne({ heroType: 'about_us' });
      if (existingAboutUs) {
        if (files && files.singleHeroImage) {
          const images = await fileUploader(files as FileArray, `${heroData.heroType}-attachment-${Date.now()}`, 'singleHeroImage');
          heroData.singleHeroImage = images
        }
        updatedContent = await Hero.findByIdAndUpdate(existingAboutUs._id, heroData);
      } else {
        if (files && files?.singleHeroImage) {
          const images = await fileUploader(files as FileArray, `${heroData.heroType}-attachment-${Date.now()}`, 'singleHeroImage');
          heroData.singleHeroImage = images
        } else {
          throw new CustomError.BadRequestError("Hero images are required for ev_charger")
        }
        createdContent = await Hero.create(heroData);
      }
      break;
    case 'contact_us':
      const existingContactUs = await Hero.findOne({ heroType: 'contact_us' });
      if (existingContactUs) {
        if (files && files.singleHeroImage) {
          const images = await fileUploader(files as FileArray, `${heroData.heroType}-attachment-${Date.now()}`, 'singleHeroImage');
          heroData.singleHeroImage = images
        }
        updatedContent = await Hero.findByIdAndUpdate(existingContactUs._id, heroData);
      } else {
        if (files && files?.singleHeroImage) {
          const images = await fileUploader(files as FileArray, `${heroData.heroType}-attachment-${Date.now()}`, 'singleHeroImage');
          heroData.singleHeroImage = images
        } else {
          throw new CustomError.BadRequestError("Hero images are required for ev_charger")
        }
        createdContent = await Hero.create(heroData);
      }
      break;
    case 'software':
      const existingSoftware = await Hero.findOne({ heroType: 'software' });
      if (existingSoftware) {
        if (files && files.singleHeroImage) {
          const images = await fileUploader(files as FileArray, `${heroData.heroType}-attachment-${Date.now()}`, 'singleHeroImage');
          heroData.singleHeroImage = images
        }
        updatedContent = await Hero.findByIdAndUpdate(existingSoftware._id, heroData);
      } else {
        if (files && files?.singleHeroImage) {
          const images = await fileUploader(files as FileArray, `${heroData.heroType}-attachment-${Date.now()}`, 'singleHeroImage');
          heroData.singleHeroImage = images
        } else {
          throw new CustomError.BadRequestError("Hero images are required for ev_charger")
        }
        createdContent = await Hero.create(heroData);
      }
      break;
    case 'news':
      const existingNews = await Hero.findOne({ heroType: 'news' });
      if (existingNews) {
        if (files && files.singleHeroImage) {
          const images = await fileUploader(files as FileArray, `${heroData.heroType}-attachment-${Date.now()}`, 'singleHeroImage');
          heroData.singleHeroImage = images
        }
        updatedContent = await Hero.findByIdAndUpdate(existingNews._id, heroData);
      } else {
        if (files && files?.singleHeroImage) {
          const images = await fileUploader(files as FileArray, `${heroData.heroType}-attachment-${Date.now()}`, 'singleHeroImage');
          heroData.singleHeroImage = images
        } else {
          throw new CustomError.BadRequestError("Hero images are required for ev_charger")
        }
        createdContent = await Hero.create(heroData);
      }
      break;
    default:
      break;
  }

  if (createdContent) {
    return sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      status: 'success',
      message: 'Hero created successfully',
      data: createdContent
    });
  }

  if (updatedContent) {
    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Hero updated successfully',
      data: updatedContent
    });
  }
}
);

// Controller to get About Us content
const getHero = asyncHandler(async (req: Request, res: Response) => {
  const hero = await Hero.find();

  if (hero.length == 0) {
    throw new CustomError.NotFoundError('No Hero found!');
  }

  return sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Hero content retrieved successfully',
    data: hero,
  });
});

// controller for update slide hero
const updateSlideHero = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const files = req.files as any;
  const { removedImg } = req.body;

  // Find hero safely
  const hero = await Hero.findById(id);
  if (!hero) {
    throw new CustomError.NotFoundError('No Hero found!');
  }

  hero.multipleHeroImages = hero.multipleHeroImages || [];

  let newImages: string[] = [];
  if (files?.newImg) {
    const uploaded = await fileUploader(
      files,
      `hero-attachment-${Date.now()}`,
      'newImg'
    );
    newImages = Array.isArray(uploaded) ? uploaded : [uploaded];
  }
  if (removedImg) {
    hero.multipleHeroImages = hero.multipleHeroImages.filter(
      (img) => img !== removedImg
    );
  }

  hero.multipleHeroImages.push(...newImages);

  await hero.save();

  return sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Hero updated successfully',
    data: hero,
  });
});

export default {
  createHero,
  getHero,
  updateSlideHero,
};
