import { IScreen } from "./screen.interface";
import Screen from "./screen.model";


class ScreenService {
    async createScreenContent(data: Partial<IScreen>) {
        return await Screen.create(data)
    }

    async getScreenContentBySoftwareId(id: string) {
        return await Screen.find({softwareId: id}).populate({
            path: 'softwareId',
            select: ''
        })
    }

    async findScreenByTitle(title: string){
        return await Screen.findOne({title})
    }

    async deleteScreenContent(id: string) {
        return await Screen.deleteOne({ _id: id })
    }

    async updateScreenContent(id: string, data: Partial<IScreen>) {
        return await Screen.updateOne({ _id: id }, data)
    }
}

export default new ScreenService();