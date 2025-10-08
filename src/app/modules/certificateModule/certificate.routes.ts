import express from 'express'
import authentication from '../../middlewares/authorization'
import { ENUM_USER_ROLE } from '../../../enums/user'
import certificateController from './certificate.controller'

const certificateRoute = express.Router()

certificateRoute.post('/create', authentication(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), certificateController.createCertificate)
certificateRoute.get('/all', certificateController.getCertificates)
certificateRoute.delete('/delete/:id', authentication(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), certificateController.deleteCertificate)

export default certificateRoute