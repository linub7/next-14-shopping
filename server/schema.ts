import {
  pgTable,
  text,
  timestamp,
  primaryKey,
  integer,
  boolean,
  pgEnum,
  serial,
  real,
} from 'drizzle-orm/pg-core';
import type { AdapterAccount } from 'next-auth/adapters';
import { createId } from '@paralleldrive/cuid2';

export const RoleEnum = pgEnum('roles', ['user', 'admin']);

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  password: text('password'),
  twoFactorEnabled: boolean('twoFactorEnabled').default(false),
  role: RoleEnum('roles').default('user'),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

/**
 * because of indexing in line 66 -> we can not set primary key
 * in id field -> so we have to create id our own -> use createId
 */
export const emailTokens = pgTable(
  'email_token',
  {
    id: text('id')
      .notNull()
      .$defaultFn(() => createId()),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
    email: text('email').notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.id, verificationToken.token],
    }),
  })
);

export const passwordResetTokens = pgTable(
  'password_reset_token',
  {
    id: text('id')
      .notNull()
      .$defaultFn(() => createId()),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
    email: text('email').notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.id, verificationToken.token],
    }),
  })
);

export const twoFactorTokens = pgTable(
  'two_factor_token',
  {
    id: text('id')
      .notNull()
      .$defaultFn(() => createId()),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
    email: text('email').notNull(),
    userID: text('userID').references(() => users.id, { onDelete: 'cascade' }),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.id, verificationToken.token],
    }),
  })
);

export const products = pgTable('product', {
  id: serial('id').primaryKey(),
  description: text('description').notNull(),
  title: text('title').notNull(),
  created: timestamp('created').defaultNow(),
  price: real('price').notNull(),
});
