import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { EntityManager } from '@mikro-orm/knex';
import { User } from './entities/User';
import path from 'path';
import { __isProd__ } from './utils/constants';
import { MikroORM, Options } from '@mikro-orm/core';
import { Conversation } from './entities/Conversation';
import { Message } from './entities/Message';

const config = {
  migrations: {
    path: path.join(__dirname, 'migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
    disableForeignKeys: false,
  },
  entities: [User, Conversation, Message],
  type: 'postgresql',
  clientUrl: process.env.DATABASE_URL,
  debug: true,
  tsNode: true,
} as Options<PostgreSqlDriver>;

export let orm: MikroORM;
export let em: EntityManager;

(async () => {
  orm = await MikroORM.init(config);
  await orm.getMigrator().up();
  em = orm.em as any;
})().catch((err) => console.log(err));

export default config;
