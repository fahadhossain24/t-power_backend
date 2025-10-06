import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'newsCategory',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    thambnail: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true
  },
    metaTitle: {
      type: String,
      required: true,
    },
    metaDescription: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const News = mongoose.model('news', newsSchema);
export default News;
