import {
  Entity,
  ManyToOne,
  OneToMany,
  Collection,
  Property,
  PrimaryKey,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Message } from './Message';
import { User } from './User';

@Entity({ tableName: 'conversations' })
export class Conversation {
  @PrimaryKey()
  id: string = v4();

  @ManyToOne(() => User)
  ownerOne: User;

  @ManyToOne(() => User)
  ownerTwo: User;

  @OneToMany(() => Message, (message) => message.conversation)
  messages = new Collection<Message>(this);

  @Property()
  lastActivity: Date = new Date();
}
