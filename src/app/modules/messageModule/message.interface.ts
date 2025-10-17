import { Document, Types } from 'mongoose';

export interface IMessage extends Document {
  conversation: Types.ObjectId;
  senderRole: string;
  type: string,
  content: string;
  attachment: string[];
  status: string;
}