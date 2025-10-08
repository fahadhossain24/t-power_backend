import { ICertificate } from "./certificate.interface";
import Certificate from "./certificate.model";

const createCertificate = async (data: Partial<ICertificate>) => {
    return await Certificate.create(data)
}

const getCertificates = async () => {
    return await Certificate.find()
}

const deleteCertificate = async (id: string) => {
    return await Certificate.deleteOne({ _id: id })
}

export default {
    createCertificate,
    getCertificates,
    deleteCertificate
}