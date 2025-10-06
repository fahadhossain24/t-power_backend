import { INewsCategory } from './newsCat.interface';
import NewsCategory from './newsCat.model';

class NewsCategoryService {
    async createNewsCategory(newsData: INewsCategory) {
        const newsCategory = new NewsCategory(newsData);
        return await newsCategory.save();
    }

    async getNewsCategory() {
        return await NewsCategory.find({})
    }

    async getNewsCategoryById(id: string) {
        return await NewsCategory.findById(id);
    }

    async getNewsCategoryByTitle(title: string) {
        return await NewsCategory.findOne({ title });
    }



    async updateNewsCategory(id: string, newsData: INewsCategory) {
        return await NewsCategory.findByIdAndUpdate(id, newsData, { new: true });
    }

    async deleteNewsCategory(id: string) {
        return await NewsCategory.deleteOne({ _id: id });
    }

}

export default new NewsCategoryService();
