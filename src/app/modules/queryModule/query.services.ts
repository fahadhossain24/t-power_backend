import asyncHandler from '../../../shared/asyncHandler'
import { IQuery } from './query.interface'
import Query from './query.model'

class QueryService {
  // Create a new query
  async createQuery(data: IQuery) {
    return await Query.create(data)
  }

  // Retrieve all queries with search and pagination
  async retrieveAllQueries(search: string, page: number, limit: number, date?: string) {
    const skip = (page - 1) * limit
    const pipeline: any[] = []

    // ----- 1️⃣ Optional search filter -----
    const matchConditions: any = {}

    if (search) {
      matchConditions.$or = [
        { queryId: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { contact: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
        { businessName: { $regex: search, $options: 'i' } },
      ]
    }

    // ----- 2️⃣ Optional date filter -----
    if (date) {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)

      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      matchConditions.createdAt = { $gte: startOfDay, $lte: endOfDay }
    }

    // Apply match only if needed
    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions })
    }

    // ----- 3️⃣ Lookup product details -----
    pipeline.push({
      $lookup: {
        from: 'products',
        localField: 'productRef',
        foreignField: '_id',
        as: 'productRef',
      },
    })

    pipeline.push({
      $unwind: {
        path: '$productRef',
        preserveNullAndEmptyArrays: true,
      },
    })

    // ----- 4️⃣ Lookup product categories -----
    pipeline.push({
      $lookup: {
        from: 'categories',
        localField: 'productRef.categories',
        foreignField: '_id',
        as: 'productRef.categories',
      },
    })

    // ----- 5️⃣ Project required fields -----
    pipeline.push({
      $project: {
        queryId: 1,
        name: 1,
        email: 1,
        contact: 1,
        businessName: 1,
        notes: 1,
        isRead: 1,
        createdAt: 1,
        updatedAt: 1,
        productRef: {
          _id: '$productRef._id',
          name: '$productRef.name',
          slug: '$productRef.slug',
          price: '$productRef.price',
          currency: '$productRef.currency',
          discount: '$productRef.discount',
          images: '$productRef.images',
          specification: '$productRef.specification',
          categories: {
            $map: {
              input: '$productRef.categories',
              as: 'cat',
              in: { _id: '$$cat._id', name: '$$cat.name' },
            },
          },
        },
      },
    })

    // ----- 6️⃣ Sort and paginate -----
    pipeline.push({ $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit })

    // ----- 7️⃣ Run aggregation -----
    const data = await Query.aggregate(pipeline)

    // ----- 8️⃣ Count total -----
    const totalData = await Query.countDocuments(matchConditions)

    return {
      meta: {
        currentPage: page,
        limit,
        totalPage: Math.ceil(totalData / limit),
        totalData,
      },
      data,
    }
  }



  // Retrieve specific query with populated product
  async retrieveSpecificQuery(id: string) {
    return await Query.findById(id)
      .populate({
        path: 'productRef',
        model: 'product',
        select: 'name slug price currency discount images specification categories',
        populate: {
          path: 'categories',
          model: 'category',
          select: 'name'
        }
      })
  }

  // Update a single query
  async updateQuery(id: string, data: Partial<IQuery>) {
    return await Query.findByIdAndUpdate(id, data, { new: true })
  }

  // Bulk update multiple queries
  async queryBulkUpdate(ids: string[], data: Partial<IQuery>) {
    return await Query.updateMany({ _id: { $in: ids } }, data)
  }

  // Delete a single query
  async deleteQuery(id: string) {
    return await Query.deleteOne({ _id: id })
  }

  // Bulk delete multiple queries
  async queryBulkDelete(ids: string[]) {
    return await Query.deleteMany({ _id: { $in: ids } })
  }

  // Get the most recent query
  async getLastQuery() {
    return await Query.findOne().sort({ _id: -1 })
  }

  // Get all queries by a specific user email
  async getAllQueriesBySpecificUserEmail(email: string, count?: number) {
    return await Query.find({ email }).sort('-createdAt').limit(count || 0)
  }

  // Get all queries (no filter)
  async getAllQueries() {
    return await Query.find({})
  }

  // Get all queries by a user (same as above for clarity)
  async getAllQueriesByUser(email: string) {
    return await Query.find({ email })
  }
}

export default new QueryService()
