import { IPortfolio } from "./portfolio.interface";
import Portfolio from "./portfolio.model";

const createPortfolio = async (data: Partial<IPortfolio>) => {
    return await Portfolio.create(data)
}

const getPortfolio = async (query: any) => {
    return await Portfolio.find(query)
}

const deletePortfolio = async (id: string) => {
    return await Portfolio.deleteOne({ _id: id })
}

export default {
    createPortfolio,
    getPortfolio,
    deletePortfolio
}