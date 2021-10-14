import { Migration } from '@mikro-orm/migrations';

export class Migration20211014081327 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" add column "is_online" bool not null, add column "last_login_at" timestamptz(0) not null;');
  }

}
