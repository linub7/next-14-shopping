import { redirect } from 'next/navigation';

import { auth } from '@/server/auth';
import { db } from '@/server';
import placeholder from '@/public/placeholder_small.jpg';
import { DataTable } from '@/components/dashboard/products/data-table';
import { columns } from '@/components/dashboard/products/data-columns';

const DashboardProductsPage = async () => {
  const session = await auth();
  if (session?.user?.role !== 'admin') redirect('/');

  const products = await db.query.products.findMany({
    with: {
      productVariants: { with: { variantImages: true, variantTags: true } },
    },
    orderBy: (products, { desc }) => [desc(products.id)],
  });
  if (!products) throw new Error('No products found');

  const dataTable = products.map((product) => {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variants: [],
      image: placeholder.src,
    };
  });
  if (!dataTable) throw new Error('No data found');
  return (
    <div>
      <DataTable columns={columns} data={dataTable} />
    </div>
  );
};

export default DashboardProductsPage;
