import {
  ADD_PRODUCT_MAX_TITLE_SIZE,
  ADD_PRODUCT_MAX_DESCRIPTION_SIZE,
} from '@/constants';
import * as z from 'zod';

export const AddProductSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(ADD_PRODUCT_MAX_TITLE_SIZE, {
    message: `Title must be at least ${ADD_PRODUCT_MAX_TITLE_SIZE} characters.`,
  }),
  description: z.string().min(ADD_PRODUCT_MAX_DESCRIPTION_SIZE, {
    message: `Description must be at least ${ADD_PRODUCT_MAX_DESCRIPTION_SIZE} characters.`,
  }),
  price: z.coerce
    .number({ invalid_type_error: 'Price must be a number' })
    .positive({ message: 'Price must be positive' }),
});
