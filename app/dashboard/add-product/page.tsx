import { redirect } from 'next/navigation';

import { auth } from '@/server/auth';
import DashboardAddProductCard from '@/components/dashboard/add-product/cards/add-product';

const DashboardAddProductPage = async () => {
  const session = await auth();
  if (session?.user?.role !== 'admin') redirect('/');
  return <DashboardAddProductCard />;
};

export default DashboardAddProductPage;
