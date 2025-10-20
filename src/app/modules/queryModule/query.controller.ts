import { Request, Response } from 'express'
import asyncHandler from '../../../shared/asyncHandler'
import QueryServices from './query.services'
import CustomError from '../../errors'
import sendResponse from '../../../shared/sendResponse'
import { StatusCodes } from 'http-status-codes'
import IdGenerator from '../../../utils/IdGenerator'
import productServices from '../productModule/product.services'

class QueryController {
  // Create a new query
  createQuery = asyncHandler(async (req: Request, res: Response) => {
    const queryData = req.body

    // Validate referenced product
    const product = await productServices.retrieveProductById(queryData.productRef)
    if (!product) {
      // throw new CustomError.NotFoundError('Product not found!')
    }

    // Optional: Validate minimum order quantity (if business logic requires)
    // if (product.minimumOrderQuantity && queryData.productRef.quantity < product.minimumOrderQuantity) {
    //   throw new CustomError.BadRequestError('Quantity is less than minimum order quantity!')
    // }

    // Generate sequential queryId
    const lastQuery = await QueryServices.getLastQuery()
    const lastQueryId = lastQuery ? parseInt(lastQuery.queryId.split('-')[1]) : 0
    queryData.queryId = IdGenerator.generateSerialId('QRY', lastQueryId, 5)

    // Create new query
    const query = await QueryServices.createQuery(queryData)
    if (!query) {
      throw new CustomError.BadRequestError('Failed to create query!')
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Query created successfully',
      data: query,
    })
  })

  // Retrieve all queries (with search + pagination)
  retrieveAllQueries = asyncHandler(async (req: Request, res: Response) => {
    const { search, date } = req.query
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    const queries = await QueryServices.retrieveAllQueries(search as string, page, limit, date as string)

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Queries retrieved successfully',
      meta: queries.meta,
      data: queries.data,
    })
  })

  // Retrieve a specific query by ID
  retrieveSpecificQuery = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    const query = await QueryServices.retrieveSpecificQuery(id)
    if (!query) {
      throw new CustomError.NotFoundError('Query not found!')
    }

    query.isRead = true
    await query.save()

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Query retrieved successfully',
      data: query,
    })
  })

  // Update a specific query
  updateQuery = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const updateData = req.body

    const query = await QueryServices.updateQuery(id, updateData)
    if (!query) {
      throw new CustomError.NotFoundError('Query not found!')
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Query updated successfully',
      data: query,
    })
  })

  // Bulk update queries
  queryBulkUpdate = asyncHandler(async (req: Request, res: Response) => {
    const { ids, data } = req.body

    const result = await QueryServices.queryBulkUpdate(ids, data)
    if (!result.modifiedCount) {
      throw new CustomError.BadRequestError('Failed to update queries!')
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Queries updated successfully',
    })
  })

  // Delete a specific query
  deleteQuery = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    const result = await QueryServices.deleteQuery(id)
    if (!result.deletedCount) {
      throw new CustomError.NotFoundError('Query not found!')
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Query deleted successfully',
    })
  })

  // Bulk delete queries
  queryBulkDelete = asyncHandler(async (req: Request, res: Response) => {
    const { ids } = req.body

    const result = await QueryServices.queryBulkDelete(ids)
    if (!result.deletedCount) {
      throw new CustomError.BadRequestError('Failed to delete queries!')
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Queries deleted successfully',
    })
  })

  // Get all queries by specific user email
  getAllQueriesBySpecificUserEmail = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.params
    const count = Number(req.query.count)

    const queries = await QueryServices.getAllQueriesBySpecificUserEmail(email, count)

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Queries retrieved successfully',
      data: queries,
    })
  })
}

export default new QueryController()
