import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from '@/server/schema';
import { POSTGRES_URL } from '@/utils/env';

const sql = neon(POSTGRES_URL!);
export const db = drizzle(sql, { schema, logger: true });
