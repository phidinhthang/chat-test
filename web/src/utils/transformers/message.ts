import { useQueryClient } from 'react-query';
import { useCurrentConversationContext } from '../../contexts/currentConversation';
import { Conversation } from '../../services/response/Conversation';
import { MessageResponse } from '../../services/response/Message';
import { User } from '../../services/response/User';

interface MessageDisplay {
  id: string;
  text: string;
}

interface OwnerDisplay {
  ownerId: string;
  ownerName: string;
  isOwner: boolean;
}

export const messagesDisplayData = () => {
  const queryClient = useQueryClient();
  const { conversationId } = useCurrentConversationContext()!;
  const me = queryClient.getQueryData<User>('me')!;
  console.log('me ', me);
  const conversations =
    queryClient.getQueryData<Conversation[]>('conversations')!;
  const conversation = conversations.find((i) => i.id === conversationId);
  if (!conversation) {
    return null;
  }
  const messages =
    queryClient.getQueryData<MessageResponse[]>([
      'messages',
      { conversationId },
    ]) || [];
  const messagesMapper: (MessageDisplay & OwnerDisplay)[] = messages.map(
    (m) => {
      const owner =
        m.ownerId === conversation.ownerOne.id
          ? conversation.ownerOne
          : conversation.ownerTwo;
      return {
        id: m.id,
        text: m.text,
        ownerId: owner.id,
        ownerName: owner.id === me.id ? 'You' : owner.username,
        isOwner: owner.id === me.id,
      };
    }
  );

  let messageGroup: {
    owner: OwnerDisplay | undefined;
    messages: MessageDisplay[];
  } = { owner: undefined, messages: [] };

  let displayData: {
    owner: OwnerDisplay | undefined;
    messages: MessageDisplay[];
  }[] = [];

  messagesMapper.forEach((m, index) => {
    if (index > 0 && m.ownerId !== messagesMapper[index - 1].ownerId) {
      displayData.push(messageGroup);
      messageGroup.owner = {
        isOwner: m.isOwner,
        ownerId: m.ownerId,
        ownerName: m.ownerName,
      };
      messageGroup.messages = [{ id: m.id, text: m.text }];
    } else {
      messageGroup.owner = {
        isOwner: m.isOwner,
        ownerId: m.ownerId,
        ownerName: m.ownerName,
      };
      messageGroup.messages.push({ id: m.id, text: m.text });
    }
  });

  return displayData;
};
