import { Migration } from '@mikro-orm/migrations';

export class Migration20211007195804 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "users" ("id" varchar(255) not null, "username" varchar(255) not null, "password" varchar(255) not null);');
    this.addSql('alter table "users" add constraint "users_pkey" primary key ("id");');

    this.addSql('create table "users_friends" ("userId" varchar(255) not null, "friendId" varchar(255) not null);');
    this.addSql('alter table "users_friends" add constraint "users_friends_pkey" primary key ("userId", "friendId");');

    this.addSql('create table "users_requests" ("userId" varchar(255) not null, "requestId" varchar(255) not null);');
    this.addSql('alter table "users_requests" add constraint "users_requests_pkey" primary key ("userId", "requestId");');

    this.addSql('alter table "users_friends" add constraint "users_friends_userId_foreign" foreign key ("userId") references "users" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "users_friends" add constraint "users_friends_friendId_foreign" foreign key ("friendId") references "users" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "users_requests" add constraint "users_requests_userId_foreign" foreign key ("userId") references "users" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "users_requests" add constraint "users_requests_requestId_foreign" foreign key ("requestId") references "users" ("id") on update cascade on delete cascade;');
  }

}
