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
  index,
} from 'drizzle-orm/pg-core';
import type { AdapterAccount } from 'next-auth/adapters';
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';

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

export const productVariants = pgTable('product_variant', {
  id: serial('id').primaryKey(),
  color: text('color').notNull(),
  productType: text('productType').notNull(),
  updated: timestamp('updated').defaultNow(),
  productID: serial('productID')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
});

export const variantImages = pgTable('variant_image', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  size: real('size').notNull(),
  name: text('name').notNull(),
  order: real('order').notNull(),
  variantID: serial('variantID')
    .notNull()
    .references(() => productVariants.id, { onDelete: 'cascade' }),
});

export const variantTags = pgTable('variant_tag', {
  id: serial('id').primaryKey(),
  tag: text('tag').notNull(),
  variantID: serial('variantID')
    .notNull()
    .references(() => productVariants.id, { onDelete: 'cascade' }),
});

export const productRelations = relations(products, ({ many }) => ({
  productVariants: many(productVariants, { relationName: 'product_variant' }),
  reviews: many(reviews, { relationName: 'review' }),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ many, one }) => ({
    product: one(products, {
      fields: [productVariants.productID],
      references: [products.id],
      relationName: 'product_variant',
    }),
    variantImages: many(variantImages, { relationName: 'variant_image' }),
    variantTags: many(variantTags, { relationName: 'variant_tag' }),
  })
);

export const variantImagesRelations = relations(variantImages, ({ one }) => ({
  productVariants: one(productVariants, {
    fields: [variantImages.variantID],
    references: [productVariants.id],
    relationName: 'variant_image',
  }),
}));

export const variantTagsRelations = relations(variantTags, ({ one }) => ({
  productVariants: one(productVariants, {
    fields: [variantTags.variantID],
    references: [productVariants.id],
    relationName: 'variant_tag',
  }),
}));

export const reviews = pgTable(
  'review',
  {
    id: serial('id').primaryKey(),
    rating: real('rating').notNull(),
    userID: text('userID')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    productID: serial('productID')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    comment: text('comment').notNull(),
    created: timestamp('created').defaultNow(),
  },
  (table) => {
    return {
      productIdx: index('productIdx').on(table.productID),
      userIdx: index('userIdx').on(table.userID),
    };
  }
);

export const reviewRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userID],
    references: [users.id],
    relationName: 'user_review',
  }),
  product: one(products, {
    fields: [reviews.productID],
    references: [products.id],
    relationName: 'reviews',
  }),
}));

export const userRelations = relations(users, ({ many }) => ({
  reviews: many(reviews, { relationName: 'user_review' }),
}));
