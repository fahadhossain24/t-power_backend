import mongoose from 'mongoose';
import { IHero } from './hero.interface';

const heroSchema = new mongoose.Schema<IHero>(
  {
    heroType: {
      type: String,
      enum: ['slide', 'product', 'portfolio', 'about_us', 'contact_us', 'news'],
      required: true
    },
    title: String,
    description: {
      type: String,
      required: true
    },
    singleHeroImage: {
      type: String,
    },
    multipleHeroImages: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

const Hero = mongoose.model<IHero>('hero', heroSchema);
export default Hero;
