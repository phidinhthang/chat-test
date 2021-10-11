import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';

@Entity({
  tableName: 'users',
})
export class User {
  @PrimaryKey()
  @SerializedPrimaryKey()
  id!: string;

  @Property()
  username!: string;

  @Property()
  password!: string;

  @Property()
  isOnline: boolean = false;

  @Property()
  lastLoginAt: Date = new Date();

  @ManyToMany(() => User, undefined, {
    joinColumn: 'userId',
    inverseJoinColumn: 'friendId',
    name: 'user_friends',
  })
  friends = new Collection<User>(this);

  @ManyToMany(() => User, undefined, {
    name: 'user_friend_requests',
    joinColumn: 'userId',
    inverseJoinColumn: 'requestId',
  })
  requests = new Collection<User>(this);
}
