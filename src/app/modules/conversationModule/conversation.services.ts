import { IConversation } from './conversation.interface';
import Conversation from './conversation.model';

// service for create new conversation
const createConversation = async (data: Partial<IConversation>) => {
  return await Conversation.create(data);
};

// service for retrive specific conversation by email
const retriveConversationByUserEmail = async (email: string) => {
  return await Conversation.findOne({ 'user.email': email });
};

// service for retrive specific conversation by conversationId
const retriveConversationByConversationId = async (conversationId: string) => {
  return await Conversation.findOne({ _id: conversationId });
};

// service for retrive all conversations by user
const retriveConversationsByUser = async (search: string = "") => {
  console.log(search)
  let query = {
        $or: [
          { 'user.email': { $regex: search, $options: 'i' } },
          { 'user.name': { $regex: search, $options: 'i' } },
        ],
      
  }
  return await Conversation.find(query).sort({ updatedAt: -1 }).populate('lastMessage');
};

export default {
  createConversation,
  retriveConversationByUserEmail,
  retriveConversationByConversationId,
  retriveConversationsByUser,
};