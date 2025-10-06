import { Request, Response } from 'express';
import BlogService from './news.services';
import CustomError from '../../errors';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../../../shared/asyncHandler';
import fileUploader from '../../../utils/fileUploader';
import { FileArray } from 'express-fileupload';
import { generateSlug } from '../../../utils/slugify';
import fileRemover from '../../../utils/fileRemover';
import config from '../../../config';
import sendMail from '../../../utils/sendEmail';
import newsServices from './news.services';
import subscribeServices from '../subscribeModule/subscribe.services';
import createNewsCategory from '../newsCategoryModule/newsCat.utils';
import newsCatService from '../newsCategoryModule/newsCat.service';

class NewsController {
  createNews = asyncHandler(async (req: Request, res: Response) => {
    const newsData = req.body;
    const files = req.files;

    // if (newsData.title) {
    //   newsData.slug = generateSlug(newsData.title);
    // }

    // create new category if not exist
    if (newsData.category) {
      const newCategory = await createNewsCategory({ title: newsData.category });
      newsData.category = newCategory._id;
    }

    const newsWithSlug = await newsServices.getNewsBySlug(newsData.slug)
    if (newsWithSlug) {
      throw new CustomError.BadRequestError("Title shouldn't duplicate!")
    }

    if (files && files.thambnail) {
      const imagePath = await fileUploader(files as FileArray, `news-image`, 'thambnail');
      newsData.thambnail = imagePath;
    }

    if (newsData.tags) {
      newsData.tags = JSON.parse(newsData.tags)
    }

    const newNews = await newsServices.createNews(newsData);

    if (!newNews) {
      throw new CustomError.BadRequestError('Failed to create news!');
    }

    // send email to subscriber email
    const subscribers = await subscribeServices.getSubscribers()

    subscribers.map(subscriber => {
      const content = `New Article is added! Check it out! 
      
      News Link: ${config.frontend_url}/news/retrieve/slug/${newNews.slug}
      `;
      // const verificationLink = `${server_base_url}/v1/auth/verify-email/${user._id}?userCode=${userData.verification.code}`
      // const content = `Click the following link to verify your email: ${verificationLink}`
      const mailOptions = {
        from: config.gmail_app_user as string,
        to: subscriber.email,
        subject: 'New Article Added',
        text: content,
      };

      sendMail(mailOptions);
    })

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      status: 'success',
      message: 'News created successfully',
      data: newNews,
    });
  });

  getNews = asyncHandler(async (req: Request, res: Response) => {
    const { search } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const news = await newsServices.getNews(search as string, page, limit);
    // console.log(news)

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'News retrieved successfully',
      data: news,
    });
  });

  getNewsById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const news = await newsServices.getNewsById(id);

    if (!news) {
      throw new CustomError.NotFoundError('News not found!');
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'News retrieved successfully',
      data: news,
    });
  });


  getNewsBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const news = await newsServices.getNewsBySlug(slug);

    if (!news) {
      throw new CustomError.NotFoundError('News not found!');
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'News retrieved successfully',
      data: news,
    });
  });

  getRecentNews = asyncHandler(async (req: Request, res: Response) => {
    const count = Number(req.query.count)
    const news = await newsServices.retrieveRecentNews(count);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Recent News retrieved successfully',
      data: news,
    });
  });

  updateNews = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const newsData = req.body;
    const files = req.files;

    const news = await newsServices.getNewsById(id);
    if (!news) {
      throw new CustomError.NotFoundError('News not found!');
    }

    if(newsData.category){
      // check existing category
      const existingCategory = await newsCatService.getNewsCategoryById(newsData.category);
      if (!existingCategory) {
        // create new category
        const newCategory = await createNewsCategory({ title: newsData.category });
        newsData.category = newCategory._id;
      }
      else{
        newsData.category = existingCategory._id;
      }
    }

    if (files && files.thambnail) {
      if (news.thambnail) {
        await fileRemover(news.thambnail);
      }
      const imagePath = await fileUploader(files as FileArray, `news-image`, 'thambnail');
      newsData.thambnail = imagePath;
    }

    if (newsData.slug) {
      const newsWithSlug: any = await newsServices.retrieveSpecificNews(newsData.slug);
      if (newsWithSlug && newsWithSlug._id.toString() !== id) {
        throw new CustomError.BadRequestError('News with this name already exists!');
      }
      if (news.slug !== newsData.slug) {
        newsData.slug = newsData.slug;
      }
    }

    const updatedNews = await newsServices.updateNews(id, newsData);

    if (!updatedNews?.isModified) {
      throw new CustomError.BadRequestError('Failed to update news!');
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'News updated successfully',
    });
  });

  deleteNews = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedNews = await newsServices.deleteNews(id);

    if (!deletedNews?.deletedCount) {
      throw new CustomError.BadRequestError('Failed to delete news!');
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'News deleted successfully',
    });
  });
}

export default new NewsController();
