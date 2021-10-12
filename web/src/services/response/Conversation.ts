import { Message } from './Message';

interface Owner {
  id: string;
  username: string;
  isOnline: boolean;
  lastLoginAt: string;
}

export interface Conversation {
  id: string;
  ownerOne: Owner;
  ownerTwo: Owner;
  messages: Message[];
  lastActivity: string;
}
