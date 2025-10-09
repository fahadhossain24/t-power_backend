import mongoose from 'mongoose';
import { IContactUs } from './contactUs.interface';

const contactUsSchema = new mongoose.Schema<IContactUs>(
  {
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    email: String,
    phone: String,
    address: String,
  },
  {
    timestamps: true,
  },
);

const ContactUs = mongoose.model<IContactUs>('contactUs', contactUsSchema);
export default ContactUs;
