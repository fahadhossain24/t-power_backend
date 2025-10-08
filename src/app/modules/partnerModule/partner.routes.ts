import express from 'express'
import partnerControllers from './partner.controller'
import authentication from '../../middlewares/authorization'
import { ENUM_USER_ROLE } from '../../../enums/user'

const partnerRouter = express.Router()

partnerRouter.post('/create', authentication(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), partnerControllers.createPartner)
partnerRouter.get('/all', partnerControllers.getPartners)
partnerRouter.delete('/delete/:id', authentication(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), partnerControllers.deletePartner)

export default partnerRouter