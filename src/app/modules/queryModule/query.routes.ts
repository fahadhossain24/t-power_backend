import express from 'express'
import QueryController from './query.controller'
import requestValidator from '../../middlewares/requestValidator'
import QueryValidationZodSchema from './query.validation'
import authentication from '../../middlewares/authorization'
import { ENUM_USER_ROLE } from '../../../enums/user'

const queryRouter = express.Router()

// Create a new query
queryRouter.post(
  '/create',
  // authentication(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  requestValidator(QueryValidationZodSchema.createQueryZodSchema),
  QueryController.createQuery
)

// Retrieve all queries (with optional search & pagination)
queryRouter.get('/retrieve/all', authentication(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), QueryController.retrieveAllQueries)

// Bulk update (admin only)
queryRouter.patch(
  '/update/bulk',
  // authentication(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  QueryController.queryBulkUpdate
)

// Bulk delete (admin only)
queryRouter.delete(
  '/delete/bulk',
  // authentication(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  QueryController.queryBulkDelete
)

// Retrieve specific query by ID
queryRouter.get(
  '/retrieve/:id',
  requestValidator(QueryValidationZodSchema.getSpecificQueryZodSchema),
  QueryController.retrieveSpecificQuery
)

// Update specific query by ID (admin only)
queryRouter.patch(
  '/update/:id',
  // authentication(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  requestValidator(QueryValidationZodSchema.getSpecificQueryZodSchema),
  QueryController.updateQuery
)

// Delete specific query by ID (admin only)
queryRouter.delete(
  '/delete/:id',
  authentication(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  requestValidator(QueryValidationZodSchema.getSpecificQueryZodSchema),
  QueryController.deleteQuery
)

// Retrieve all queries by a specific user email
queryRouter.get('/retrieve/user/:email', QueryController.getAllQueriesBySpecificUserEmail)

export default queryRouter
