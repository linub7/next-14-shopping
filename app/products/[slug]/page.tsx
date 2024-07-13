import { eq } from 'drizzle-orm';

import { db } from '@/server';
import { productVariants } from '@/server/schema';
import SingleProductPageProductType from '@/components/home/single-product/product-type';
import { Separator } from '@/components/ui/separator';
import { priceFormatter } from '@/lib/price-formatter';
import SingleProductPageProductPick from '@/components/home/single-product/product-pick';

export async function generateStaticParams() {
  const data = await db.query.productVariants.findMany({
    with: {
      product: true,
      variantImages: true,
      variantTags: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });
  if (!data) return [];

  const slugIDs = data.map((variant) => ({ slug: variant.id.toString() }));
  return slugIDs;
}

type Props = {
  params: { slug: string };
};

const SingleProductPage = async (props: Props) => {
  const {
    params: { slug },
  } = props;
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(slug)),
    with: {
      product: {
        with: {
          productVariants: {
            with: {
              variantImages: true,
              variantTags: true,
            },
          },
        },
      },
      variantImages: true,
      variantTags: true,
    },
  });
  if (variant) {
    return (
      <main>
        <section>
          <div>
            <h1>Images</h1>
          </div>
          <div className="flex gap-2 flex-col flex-1">
            <h2 className="">{variant?.product?.title}</h2>
            <div>
              <SingleProductPageProductType
                variants={variant.product.productVariants}
              />
            </div>
            <Separator />
            <p className="text-2xl font-medium">
              {priceFormatter(variant.product.price)}
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: variant.product.description }}
            ></div>
            <p className="text-secondary-foreground">Available colors</p>
            <div className="flex gap-4">
              {variant.product.productVariants.map((item) => (
                <SingleProductPageProductPick
                  key={item.id}
                  color={item.color}
                  id={item.id}
                  image={item.variantImages[0]?.url}
                  price={variant.product.price}
                  productID={variant.productID}
                  productType={item.productType}
                  title={variant.product.title}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }
};

export default SingleProductPage;
