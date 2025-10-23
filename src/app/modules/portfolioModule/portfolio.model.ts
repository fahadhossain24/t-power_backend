import mongoose from 'mongoose';
import { IPortfolio } from './portfolio.interface';

const portfolioSchema = new mongoose.Schema<IPortfolio>(
  {
    contentType: {
      type: String,
      enum: ['review', 'video'],
      required: true
    },
    clientName: String,
    review: String,
    clientImg: String,
    videoUrl: String,
  },
  {
    timestamps: true,
  },
);

const Portfolio = mongoose.model<IPortfolio>('portfolio', portfolioSchema);
export default Portfolio;
