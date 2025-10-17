// controller for create new messages inside a conversation

import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import CustomError from '../../errors';
import messageServices from './message.services';
import { Request, Response } from 'express';
import fileUploader from '../../../utils/fileUploader';
import { FileArray } from 'express-fileupload';
import Attachment from '../attachmentModule/attachment.model';
import SocketManager from '../../../socket/socket.manager';
// import createNotification from '../../../utils/notificationCreator';
import conversationService from '../conversationModule/conversation.services';
import { Types } from 'mongoose';

const createMessage = async (req: Request, res: Response) => {
  const messageData = req.body;
  const files = req.files;
  const socketManager = SocketManager.getInstance();

  // Validate and sanitize message data
  //   messageData.content = validator.escape(messageData.content);

  if (messageData.type === 'attachment') {
    if (!files || !files.attachment) {
      throw new CustomError.BadRequestError('Missing attachment in request');
    }

    const attachmentPath = await fileUploader(files as FileArray, `${messageData.type}-attachment-${Date.now()}`, 'attachment');
    messageData.attachment = attachmentPath as string;
  }

  const message = await messageServices.createMessage(messageData);
  socketManager.sendMessage(messageData.conversation, message)

  if (!message) {
    throw new CustomError.BadRequestError('Failed to create message.');
  }

  if (messageData.type === 'attachment') {
    const attachmentPayload = {
      conversation: messageData.conversation,
      message: message._id,
      type: messageData.type,
      content: messageData.attachment,
    };

    await Attachment.create(attachmentPayload);
  }

  const conversation = await conversationService.retriveConversationByConversationId(messageData.conversation);

  if (conversation) {
    conversation.lastMessage = message._id as unknown as Types.ObjectId;
    conversation.isActive = false;
    await conversation.save();
  }

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: `Message sended successfull`,
    data: message,
  });
};

// controller for get all messages of a conversation
const retriveMessagesByConversation = async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const messages = await messageServices.retriveMessages(conversationId);

  const conversation = await conversationService.retriveConversationByConversationId(conversationId)
  if (conversation) {
    conversation.isActive = true
    await conversation.save()
  }

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: `Messages retrive successfull`,
    data: messages,
  });
};

export default {
  createMessage,
  retriveMessagesByConversation,
};