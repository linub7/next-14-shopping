import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({
  path: '.env.local',
});

export default defineConfig({
  schema: './server/schema.ts',
  out: './server/migrations',
  dialect: 'postgresql', // 'postgresql' | 'mysql' | 'sqlite'
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
