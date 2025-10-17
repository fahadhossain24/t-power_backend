import mongoose from 'mongoose';
import { IConversation } from './conversation.interface';

const conversationSchema = new mongoose.Schema<IConversation>(
  {
    user:{
      name: {
        type: String,
        default: null
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'message',
      default: null
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  },
);

conversationSchema.index({
  'user.name': 'text'
})

const Conversation = mongoose.model<IConversation>('conversation', conversationSchema);
export default Conversation;