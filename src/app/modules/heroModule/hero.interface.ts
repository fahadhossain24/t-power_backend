import { Document } from 'mongoose';

export interface IHero extends Document {
  heroType: string;
  title: string;
  description: string;
  singleHeroImage?: string;
  multipleHeroImages?: string[];
}
