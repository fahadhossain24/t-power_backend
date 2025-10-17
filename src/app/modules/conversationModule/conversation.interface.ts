import { Document, Types } from 'mongoose';

export interface IConversation extends Document {
  user: {
    name?: string;
    email: string;
  };
  lastMessage: Types.ObjectId;
  isActive: boolean;
}