import algoliaSearch from 'algoliasearch';
import {
  NEXT_PUBLIC_ALGOLIA_APPLICATION_ID,
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
} from '@/utils/env';

export const searchClient = algoliaSearch(
  NEXT_PUBLIC_ALGOLIA_APPLICATION_ID!,
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
);
