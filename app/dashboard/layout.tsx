import { ReactNode } from 'react';
import {
  BarChart,
  Package,
  PenSquare,
  Settings,
  TruckIcon,
} from 'lucide-react';

import { auth } from '@/server/auth';
import DashboardsNav from '@/components/shared/navigation/dashboards';

type Props = {
  children: ReactNode;
};

const DashboardsLayout = async (props: Props) => {
  const session = await auth();

  const USER_LINKS = [
    {
      label: 'Orders',
      path: '/dashboard/orders',
      icon: <TruckIcon size={16} />,
    },
    {
      label: 'Settings',
      path: '/dashboard/settings',
      icon: <Settings size={16} />,
    },
  ] as const;
  const ADMIN_LINKS =
    session?.user?.role === 'admin'
      ? [
          {
            label: 'Analytics',
            path: '/dashboard/analytics',
            icon: <BarChart size={16} />,
          },
          {
            label: 'Products',
            path: '/dashboard/products',
            icon: <Package size={16} />,
          },
          {
            label: 'Add Product',
            path: '/dashboard/add-product',
            icon: <PenSquare size={16} />,
          },
        ]
      : [];
  const ALL_LINKS = [...ADMIN_LINKS, ...USER_LINKS];

  return (
    <div>
      <DashboardsNav links={ALL_LINKS} />
      {props.children}
    </div>
  );
};

export default DashboardsLayout;
