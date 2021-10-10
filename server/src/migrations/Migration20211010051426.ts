import { Migration } from '@mikro-orm/migrations';

export class Migration20211010051426 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "conversations" ("id" varchar(255) not null, "owner_one_id" varchar(255) not null, "owner_two_id" varchar(255) not null, "last_activity" timestamptz(0) not null);');
    this.addSql('alter table "conversations" add constraint "conversations_pkey" primary key ("id");');

    this.addSql('create table "messages" ("id" varchar(255) not null, "owner_id" varchar(255) not null, "conversation_id" varchar(255) not null, "text" varchar(255) not null, "created_at" timestamptz(0) not null, "status" text check ("status" in (\'SENDING\', \'SENT\', \'READ\')) not null, "is_deleted" bool not null);');
    this.addSql('alter table "messages" add constraint "messages_pkey" primary key ("id");');

    this.addSql('alter table "conversations" add constraint "conversations_owner_one_id_foreign" foreign key ("owner_one_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "conversations" add constraint "conversations_owner_two_id_foreign" foreign key ("owner_two_id") references "users" ("id") on update cascade;');

    this.addSql('alter table "messages" add constraint "messages_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "messages" add constraint "messages_conversation_id_foreign" foreign key ("conversation_id") references "conversations" ("id") on update cascade;');
  }

}
