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

  @Property({ nullable: true })
  email?: string;

  @Property()
  password!: string;

  @Property({ nullable: true })
  googleId?: string;

  @Property({ nullable: true })
  avatarUrl?: string;

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
