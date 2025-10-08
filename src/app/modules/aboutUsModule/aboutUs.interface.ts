import { Document } from 'mongoose';

export interface IAboutUs extends Document {
  title: string;
  contentType: string;
  description: string;
  imgUrl_1: string;
  imgUrl_2?: string;
}
