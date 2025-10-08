import { IPartner } from "./partner.interface";
import Partner from "./partner.model";

const createPartner = async (data: Partial<IPartner>) => {
    return await Partner.create(data)
}

const getPartners = async () => {
    return await Partner.find()
}

const deletePartner = async (id: string) => {
    return await Partner.deleteOne({ _id: id })
}

export default {
    createPartner,
    getPartners,
    deletePartner
}