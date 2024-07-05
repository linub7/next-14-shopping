import { DOMAIN_URL, VERCEL_URL } from './env';

const getBaseURL = () => {
  if (typeof window !== 'undefined') return '';
  if (VERCEL_URL) return `https://${DOMAIN_URL}`;
  return 'http://localhost:3000';
};

export default getBaseURL;
