import { redirect } from 'next/navigation';

import { auth } from '@/server/auth';

const DashboardAnalyticsPage = async () => {
  const session = await auth();
  if (session?.user?.role !== 'admin') redirect('/');
  return <div>DashboardAnalyticsPage</div>;
};

export default DashboardAnalyticsPage;
