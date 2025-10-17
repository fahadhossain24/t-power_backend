import { IMessage } from './message.interface';
import Message from './message.model';

// service for create new message
const createMessage = async (data: Partial<IMessage>) => {
  return await Message.create(data);
};

// service for retrive all message by conversation Id
const retriveMessages = async (id: string) => {
  return await Message.find({ conversation: id })
};

export default {
  createMessage,
  retriveMessages,
};