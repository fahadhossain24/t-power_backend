import { INews } from './news.interface';
import News from './news.model';

class NewsService {
  async createNews(newsData: INews) {
    const news = new News(newsData);
    return await news.save();
  }

  async getNews(search?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const pipeline: any[] = [];

    console.log(search)

    // Search stage using Atlas Full-Text Search
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: search, $options: 'i' } }, // 'i' = case-insensitive
            { content: { $regex: search, $options: 'i' } },
            { slug: { $regex: search, $options: 'i' } },
            { metaTitle: { $regex: search, $options: 'i' } },
            { metaDescription: { $regex: search, $options: 'i' } },
          ],
        },
      });
    }

    // Populate Categories
    pipeline.push({
      $lookup: {
        from: 'newsCategories',
        localField: 'newsCategory',
        foreignField: '_id',
        as: 'newsCategory',
      },
    })

    // Sort, skip, limit for pagination
    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    );

    // Execute aggregation
    const data = await News.aggregate(pipeline);
    const totalData = await News.countDocuments();

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

  async getNewsBySlug(slug: string){
    return await News.findOne({slug})
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
