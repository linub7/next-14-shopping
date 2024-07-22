import Algolia from '@/components/home/algolia';
import ProductTags from '@/components/home/product-tags';
import HomeProducts from '@/components/home/products';
import { db } from '@/server';

export const revalidate = 60 * 60;

export default async function Home() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });

  if (!data) throw new Error('No Products found');
  return (
    <main>
      <Algolia />
      <ProductTags />
      <HomeProducts variants={data} />
    </main>
  );
}
