import mongoose from 'mongoose';
import { IHero } from './hero.interface';

const heroSchema = new mongoose.Schema<IHero>(
  {
    heroType: {
      type: String,
      enum: ['slide', 'landing', 'ev_charger', 'kehua_inverter', 'energy_storage', 'about_us', 'contact_us', 'software', 'news'],
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
