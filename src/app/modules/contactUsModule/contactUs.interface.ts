import { Document } from 'mongoose';

export interface IContactUs extends Document {
  image: string;
  description: string;
  email: string;
  phone: string;
  address: string;
}
