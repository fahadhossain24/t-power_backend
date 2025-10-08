import mongoose from 'mongoose';
import { INews } from './news.interface';
import News from './news.model';

class NewsService {
  async createNews(newsData: INews) {
    const news = new News(newsData);
    return await news.save();
  }

  async getNews(search?: string, category?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const pipeline: any[] = [];

    const matchStage: any = {};

    // Search filter
    if (search) {
      matchStage.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { metaTitle: { $regex: search, $options: 'i' } },
        { metaDescription: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category) {
      matchStage.category = new mongoose.Types.ObjectId(category);
    }

    // Apply match stage if needed
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Populate category directly (only _id and title)
    pipeline.push({
      $lookup: {
        from: 'newscategories', // MongoDB collection name
        localField: 'category',
        foreignField: '_id',
        as: 'category',
        pipeline: [
          { $project: { _id: 1, title: 1 } }, // only _id and title
        ],
      },
    });

    // Convert populated array → single object
    pipeline.push({
      $unwind: {
        path: '$category',
        preserveNullAndEmptyArrays: true,
      },
    });

    // Sort and paginate
    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    );

    // Execute aggregation
    const data = await News.aggregate(pipeline);

    // Get total count with same filters
    const countPipeline: any[] = [];
    if (Object.keys(matchStage).length > 0) countPipeline.push({ $match: matchStage });
    countPipeline.push({ $count: 'total' });

    const totalResult = await News.aggregate(countPipeline);
    const totalData = totalResult[0]?.total || 0;

    // Return result
    return {
      meta: {
        currentPage: page,
        limit,
        totalPage: Math.ceil(totalData / limit),
        totalData,
      },
      data,
    };
  }

  async getNewsById(id: string) {
    return await News.findById(id);
  }

  async getNewsBySlug(slug: string) {
    return await News.findOne({ slug }).populate({
      path: 'category',
      select: 'title',
    })
  }

  async retrieveSpecificNews(slug: string) {
    return await News.findOne({ slug });
  }

  async updateNews(id: string, newsData: INews) {
    return await News.findByIdAndUpdate(id, newsData, { new: true });
  }

  async deleteNews(id: string) {
    return await News.deleteOne({ _id: id });
  }

  async retrieveRecentNews(count: number = 10) {
    return await News.find({}).sort('-createdAt').limit(count)
  }
}

export default new NewsService();
