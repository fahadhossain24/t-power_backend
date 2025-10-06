import mongoose from 'mongoose';

const newsCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  },
);

const NewsCategory = mongoose.model('newsCategory', newsCategorySchema);
export default NewsCategory;
