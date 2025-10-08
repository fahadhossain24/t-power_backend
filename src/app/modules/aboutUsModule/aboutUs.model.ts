import mongoose from 'mongoose';
import { IAboutUs } from './aboutUs.interface';

const abountUsSchema = new mongoose.Schema<IAboutUs>(
  {
    title: String,
    contentType: {
      type: String,
      enum: ['about_us', 'mission', 'vision'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    imgUrl_1: {
      type: String,
      required: true
    },
    imgUrl_2: String,
  },
  {
    timestamps: true,
  },
);

const AboutUs = mongoose.model<IAboutUs>('aboutUs', abountUsSchema);
export default AboutUs;
