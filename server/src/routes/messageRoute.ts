import * as messageController from '../controllers/messageController';
import { Router } from 'express';

const route = Router();

route.get('/conversations', messageController.getConversations);
route.get('/', messageController.getMessages);
route.post('/conversations', messageController.createConversation);
route.delete('/', messageController.deleteMessage);
route.post('/', messageController.sendMessage);

export { route as messageRoute };
