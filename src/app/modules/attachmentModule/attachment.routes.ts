import express from 'express';
import attachmentControllers from './attachment.controllers';

const attachmentRouter = express.Router();

attachmentRouter.get('/retrieve/:conversationId', attachmentControllers.retriveAttachmentByConversation)

export default attachmentRouter;