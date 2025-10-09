import express from 'express'
import screenControllers from './screen.controllers'
import authentication from '../../middlewares/authorization'
import { ENUM_USER_ROLE } from '../../../enums/user'

const screenRouter = express.Router()

screenRouter.post('/create', authentication(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), screenControllers.createScreenContent)

screenRouter.get('/retrieve/software/:id', screenControllers.getScreenContentBySoftwareId)

screenRouter.patch('/update/:id', authentication(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), screenControllers.updateSpecificScreenContent)

export default screenRouter
