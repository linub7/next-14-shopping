import * as dotenv from 'dotenv';

dotenv.config();

export const POSTGRES_URL = process.env.POSTGRES_URL;
export const AUTH_SECRET = process.env.AUTH_SECRET;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
