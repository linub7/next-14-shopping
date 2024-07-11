import { VariantsWithImagesTags } from '@/lib/infer-type';

export type ProductColumn = {
  id: number;
  title: string;
  image: string;
  variants: VariantsWithImagesTags[];
  price: number;
};
