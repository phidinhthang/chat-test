import { Entity, Property, ManyToOne, Enum, PrimaryKey } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Conversation } from './Conversation';
import { User } from './User';

enum Status {
  SENDING = 'SENDING',
  SENT = 'SENT',
  READ = 'READ',
}

@Entity({ tableName: 'messages' })
export class Message {
  @PrimaryKey()
  id: string = v4();

  @ManyToOne(() => User)
  owner: User;

  @ManyToOne(() => Conversation)
  conversation: Conversation;

  @Property()
  text: string;

  @Property()
  createdAt: Date = new Date();

  @Enum(() => Status)
  status = Status.SENDING;

  @Property()
  isDeleted: boolean = false;
}
