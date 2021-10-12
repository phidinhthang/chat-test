import { Conversation } from './Conversation';
import { User } from './User';

enum STATUS {
  sending = 'SENDING',
  sent = 'SENT',
}

export interface Message {
  id: string;
  text: string;
  createdAt: string;
  isDeleted: boolean;
  status: STATUS;
  owner: User;
  conversation: Conversation;
}

export interface MessageResponse {
  id: string;
  ownerId: string;
  conversationId: string;
  text: string;
  createdAt: string;
  status: string;
  isDeleted: boolean;
}
