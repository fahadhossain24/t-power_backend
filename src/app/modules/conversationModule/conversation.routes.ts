import express from 'express';
import conversationControllers from './conversation.controllers';

const conversationRouter = express.Router();

conversationRouter.post('/create-or-retrieve', conversationControllers.createConversation)
conversationRouter.get('/retrieve', conversationControllers.retriveConversations)

export default conversationRouter;