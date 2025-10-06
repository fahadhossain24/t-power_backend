import newsCatService from "./newsCat.service";
import CustomError from "../../errors";

const createNewsCategory = async(newsCategoryData: any) => {
    // console.log(newsCategoryData)
    const existingCategory = await newsCatService.getNewsCategoryByTitle(newsCategoryData.title)
    // console.log("asdfasdfsdfsdf", existingCategory)
    if(!existingCategory){
        const newsCategory = await newsCatService.createNewsCategory(newsCategoryData);
        if (!newsCategory) {
            throw new CustomError.BadRequestError("Failed to create news category!")
        }
        return newsCategory
    }
    return existingCategory
}

export default createNewsCategory
