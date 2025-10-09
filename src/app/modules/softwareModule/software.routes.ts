import express from 'express'
import softwareControllers from './software.controllers'
import authentication from '../../middlewares/authorization'
import { ENUM_USER_ROLE } from '../../../enums/user'

const softwareRouter = express.Router()

softwareRouter.post('/create', authentication(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), softwareControllers.createSoftwareContent)

softwareRouter.get('/retrieve', softwareControllers.getSoftwareContent)

softwareRouter.patch('/update/:id', authentication(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), softwareControllers.updateSpecificSoftwareContent)

export default softwareRouter
