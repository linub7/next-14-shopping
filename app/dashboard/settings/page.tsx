import { redirect } from 'next/navigation';

import { auth } from '@/server/auth';
import DashboardSettingsCard from '@/components/dashboard/settings/card';

const DashboardSettingsPage = async () => {
  const session = await auth();
  if (!session) redirect('/');
  return <DashboardSettingsCard {...session?.user} />;
};

export default DashboardSettingsPage;
