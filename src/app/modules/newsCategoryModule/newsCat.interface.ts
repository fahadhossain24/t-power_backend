import { Document, Types } from 'mongoose';

export interface INewsCategory extends Document {
  _id: Types.ObjectId;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}
