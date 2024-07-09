import { redirect } from 'next/navigation';

import { auth } from '@/server/auth';

const DashboardProductsPage = async () => {
  const session = await auth();
  if (session?.user?.role !== 'admin') redirect('/');
  return <div>DashboardProductsPage</div>;
};

export default DashboardProductsPage;
