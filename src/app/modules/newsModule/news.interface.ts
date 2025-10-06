import { Document, Types } from 'mongoose';

export interface INews extends Document {
  category: Types.ObjectId;
  title: string;
  thambnail: string;
  content: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
