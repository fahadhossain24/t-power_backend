import Category from './category.model';
import { ICategory } from './category.interface';
import { generateSlug } from '../../../utils/slugify';

class CategoryService {
  async createCategory(data: ICategory) {
    const slug = generateSlug(data.name);
    const category = await Category.create({ ...data, slug });
    return category;
  }

  async retrieveAllCategory(
    search?: string,
    visibilityFilter?: Partial<ICategory["visibility"]>,
    page = 1,
    limit = 10
  ) {
    const skip = (page - 1) * limit;
    const pipeline: any[] = [];

    // Atlas Full-Text Search
    if (search) {
      pipeline.push({
        $search: {
          index: "category", // make sure this index exists in MongoDB Atlas
          compound: {
            should: [
              {
                autocomplete: {
                  query: search,
                  path: "name",
                  fuzzy: { maxEdits: 1, prefixLength: 1 },
                },
              },
              {
                autocomplete: {
                  query: search,
                  path: "metaTitle",
                  fuzzy: { maxEdits: 1, prefixLength: 1 },
                },
              },
              {
                autocomplete: {
                  query: search,
                  path: "slug",
                  fuzzy: { maxEdits: 1, prefixLength: 1 },
                },
              },
            ],
          },
        },
      });
    }

    // Match for soft-delete + visibility
    const matchStage: any = { isDeleted: false };

    if (visibilityFilter) {
      for (const [key, value] of Object.entries(visibilityFilter)) {
        matchStage[`visibility.${key}`] = value;
      }
    }

    pipeline.push({ $match: matchStage });

    // Sort, skip, limit
    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    );

    // Run pipeline
    const data = await Category.aggregate(pipeline);
    const totalData = await Category.countDocuments(matchStage);

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

  async retrieveSpecificCategory(slug: string) {
    console.log(slug)
    return await Category.findOne({ slug, isDeleted: false });
  }

  async retrieveSpecificCategoryById(id: string) {
    return await Category.findById(id);
  }

  async updateSpecificCategory(id: string, data: Partial<ICategory>) {
    return await Category.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteSpecificCategory(id: string, oldSlug: string) {
    return await Category.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        "visibility.isActive": false,
        "visibility.navbar": false,
        "visibility.homepage": false,
        slug: `${oldSlug}-deleted-${Date.now()}`,
      },
      { new: true }
    );
  }

  async retrieveCategoriesWithSomeProducts(count: number) {
    const categories = await Category.aggregate([
      {
        $match: {
          "visibility.isActive": true,
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "products",
          let: { categoryId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$$categoryId", "$categories"] },
                    { $eq: ["$visibility", true] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: count },
          ],
          as: "products",
        },
      },
      {
        $project: {
          name: 1,
          slug: 1,
          metaTitle: 1,
          metaDescription: 1,
          image: 1,
          products: 1,
        },
      },
    ]);

    return categories;
  }
}

export default new CategoryService();
