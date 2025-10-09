import { ISoftware } from "./software.interface";
import Software from "./software.model";


class SoftwareService {
    async createSoftwareContent(data: Partial<ISoftware>) {
        return await Software.create(data)
    }

    async getSoftwareContent() {
        return await Software.find()
    }

    async findSoftwareByTitle(title: string){
        return await Software.findOne({title})
    }

    async deleteSoftwareContent(id: string) {
        return await Software.deleteOne({ _id: id })
    }

    async updateSoftwareContent(id: string, data: Partial<ISoftware>) {
        return await Software.updateOne({ _id: id }, data)
    }
}

export default new SoftwareService();