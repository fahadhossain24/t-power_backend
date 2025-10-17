import express from 'express';
import messageControllers from './message.controllers';

const messageRouter = express.Router();

messageRouter.post('/send', messageControllers.createMessage)
messageRouter.get('/retrieve/:conversationId', messageControllers.retriveMessagesByConversation)

export default messageRouter;