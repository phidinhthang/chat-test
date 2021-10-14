import { useQueryClient, InfiniteData } from 'react-query';
import { useCurrentConversationContext } from '../../contexts/currentConversation';
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
  const conversations =
    queryClient.getQueryData<
      {
        id: string;
        lastActivity: string;
        other: {
          id: string;
          username: string;
          isOnline: boolean;
          lastLoginAt: string;
        };
        latestMsg: {
          id: string;
          text: string;
          createdAt: string;
          isDeleted: string;
          status: string;
          owner: string;
        };
      }[]
    >('conversations') || [];
  const conversation = conversations.find((i) => i.id === conversationId);
  if (!conversation) {
    return [];
  }
  console.log('conversation ', conversationId);
  const messagesPages = queryClient.getQueryData<
    InfiniteData<MessageResponse[]>
  >(['messages', { conversationId }])!;
  const dataPerPage: {
    owner: OwnerDisplay | undefined;
    messages: MessageDisplay[];
  }[][] = [];
  messagesPages.pages.forEach((messages) => {
    const messagesMapper: (MessageDisplay & OwnerDisplay)[] = messages.map(
      (m) => {
        const owner =
          m.ownerId === conversation.other.id ? conversation.other : me;
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
      if (
        index > 0 &&
        m.ownerId !== messagesMapper[index - 1].ownerId &&
        index !== messagesMapper.length - 1
      ) {
        displayData.push(messageGroup);
        console.log('messagegroup ', messageGroup, 'index ', index);
        messageGroup.owner = {
          isOwner: m.isOwner,
          ownerId: m.ownerId,
          ownerName: m.ownerName,
        };
        messageGroup.messages = [{ id: m.id, text: m.text }];
      } else if (
        index > 0 &&
        m.ownerId !== messagesMapper[index - 1].ownerId &&
        index === messagesMapper.length - 1
      ) {
        displayData.push({
          messages: [{ id: m.id, text: m.text }],
          owner: {
            isOwner: m.isOwner,
            ownerId: m.ownerId,
            ownerName: m.ownerName,
          },
        });
      } else if (messagesMapper.length === 1) {
        displayData.push({
          messages: [{ id: m.id, text: m.text }],
          owner: {
            isOwner: m.isOwner,
            ownerId: m.ownerId,
            ownerName: m.ownerName,
          },
        });
      } else if (index == 0) {
        messageGroup.owner = {
          isOwner: m.isOwner,
          ownerId: m.ownerId,
          ownerName: m.ownerName,
        };
        messageGroup.messages.push({ id: m.id, text: m.text });
      } else if (
        index > 0 &&
        m.ownerId === messagesMapper[index - 1].ownerId &&
        index !== messagesMapper.length - 1
      ) {
        messageGroup.messages.push({ id: m.id, text: m.text });
      } else if (
        index > 0 &&
        m.ownerId === messagesMapper[index - 1].ownerId &&
        index === messagesMapper.length - 1
      ) {
        messageGroup.messages.push({ id: m.id, text: m.text });
        displayData.push(messageGroup);
      }
    });

    console.log('messagesMapper', messagesMapper);
    console.log('displayData', displayData);

    dataPerPage.push(displayData);
  });
  return dataPerPage;
};
