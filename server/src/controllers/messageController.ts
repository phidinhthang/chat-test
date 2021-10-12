import { em } from '../mikro-orm.config';
import { Message } from '../entities/Message';
import { Conversation } from '../entities/Conversation';
import { User } from '../entities/User';
import { Request, Response } from 'express';
import { getUserId } from '../utils/getUserId';
// import { QueryOrder } from '@mikro-orm/core';

export const sendMessage = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { otherId, text }: { otherId: string; text: string } = req.body;
  if (!userId) {
    return res.status(403).json({ message: 'token expired.' });
  }

  let conversation = await em.findOne(Conversation, {
    $or: [
      {
        ownerOne: userId,
        ownerTwo: otherId,
      },
      {
        ownerOne: otherId,
        ownerTwo: userId,
      },
    ],
  });

  if (!conversation) {
    console.log('create new conversation');
    const user = await em.findOneOrFail(User, userId);
    const other = await em.findOneOrFail(User, otherId);
    conversation = em.create(Conversation, {
      ownerOne: user,
      ownerTwo: other,
    });
    await em.persistAndFlush(conversation);
  }

  const message = em.create(Message, { owner: userId, conversation, text });
  conversation.lastActivity = message.createdAt;
  await em.persistAndFlush([message, conversation]);

  return res.status(200).json(message);
};

export const createConversation = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { otherId }: { otherId: string } = req.body;
  if (!userId) {
    return res.status(403).json({ message: 'token expired.' });
  }

  let conversation = await em.findOne(Conversation, {
    $or: [
      {
        ownerOne: userId,
        ownerTwo: otherId,
      },
      {
        ownerOne: otherId,
        ownerTwo: userId,
      },
    ],
  });

  if (!conversation) {
    console.log('create new conversation');
    const user = await em.findOneOrFail(User, userId);
    const other = await em.findOneOrFail(User, otherId);
    conversation = em.create(Conversation, {
      ownerOne: user,
      ownerTwo: other,
    });
    await em.persistAndFlush(conversation);
  }

  return res.status(201).send(true);
};

export const getConversations = async (req: Request, res: Response) => {
  const userId = getUserId(req);

  const conversations = await em.getConnection('read').execute(
    `
			select c.*,
      m.id as message_id, m.owner_id as message_onwer_id, m.text as message_text, m.created_at as message_created_at, m.status as message_status, m.is_deleted as message_is_deleted, 
      owner_one.id as owner_one_id, owner_one.username as owner_one_username, owner_one.is_online as owner_one_is_online, owner_one.last_login_at as owner_one_last_login_at, 
      owner_two.id as owner_two_id, owner_two.username as owner_two_username, owner_two.is_online as owner_two_is_online, owner_two.last_login_at as owner_two_last_login_at, 
      from conversations c
			left join messages m on c."id" = m."conversation_id"
      left join users owner_one on owner_one."id" = c."owner_one_id"
      left join users owner_two on owner_two."id" = c."owner_two_id"
			where (c."owner_one_id" = ? or c."owner_two_id" = ?) 
			and m."id" in (
				select id from messages order by messages."created_at" desc limit 1
			)
      order by c.last_activity desc limit 10
		`,
    [userId, userId]
  );
  const myMap: Record<string, any> = {};
  conversations.forEach((c) => {
    myMap[c.id] = {
      id: c.id,
      lastActivity: c.last_activity,
      ownerOne: {
        id: c.owner_one_id,
        username: c.owner_one_username,
        isOnline: c.owner_one_is_online,
        lastLoginAt: c.owner_two_last_login_at,
      },
      ownerTwo: {
        id: c.owner_two_id,
        username: c.owner_two_username,
        isOnline: c.owner_two_is_online,
        lastLoginAt: c.owner_two_last_login_at,
      },
      messages: [
        {
          id: c.message_id,
          text: c.message_text,
          createdAt: c.message_created_at,
          isDeleted: c.message_is_deleted,
          status: c.message_status,
          owner: c.message_owner_id,
        },
      ],
    };
  });

  res.status(200).json(conversations.map((c) => myMap[c.id]));
};

export const deleteMessage = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { messageId }: { messageId: string } = req.body;

  const message = await em.nativeDelete(Message, {
    owner: userId,
    id: messageId,
  });
  console.log(message);

  return res.status(200).send(true);
};

export const getMessages = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const {
    conversationId,
    limit = 5,
    cursor,
  }: { conversationId: string; limit: number; cursor?: string } = req.body;
  await em.findOneOrFail(Conversation, {
    $or: [{ ownerOne: userId }, { ownerTwo: userId }],
    id: conversationId,
  });
  let replacements = [];
  if (cursor) {
    replacements = [conversationId, cursor, limit];
  } else {
    replacements = [conversationId, limit];
  }

  const messages = await em.getConnection('read').execute(
    `
		select m.* from messages m
		where m.conversation_id = ? ${cursor ? `and m."created_at" < ? ` : ``}
		order by m."created_at" desc
		limit ?
	`,
    replacements
  );

  const myMap: Record<string, any> = {};
  messages.forEach((m) => {
    myMap[m.id] = {
      id: m.id,
      ownerId: m.owner_id,
      conversationId: m.conversation_id,
      text: m.text,
      createdAt: m.created_at,
      status: m.status,
      isDeleted: m.is_deleted,
    };
  });
  return res.status(200).json(messages.map((m) => myMap[m.id]));
};
