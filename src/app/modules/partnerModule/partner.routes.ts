import express from 'express'
import partnerControllers from './partner.controller'
import authentication from '../../middlewares/authorization'
import { ENUM_USER_ROLE } from '../../../enums/user'

const partnerRouter = express.Router()

partnerRouter.use(authentication(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN))

partnerRouter.post('/create', partnerControllers.createPartner)
partnerRouter.get('/all', partnerControllers.getPartners)
partnerRouter.delete('/delete/:id', partnerControllers.deletePartner)

export default partnerRouter