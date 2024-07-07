import { redirect } from 'next/navigation';

const DashboardPage = () => {
  redirect('/dashboard/settings');
  return <div>DashboardPage</div>;
};

export default DashboardPage;
