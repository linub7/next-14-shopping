import { redirect } from 'next/navigation';
import { desc } from 'drizzle-orm';

import { auth } from '@/server/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { db } from '@/server';
import { orderProduct } from '@/server/schema';
import DashboardAnalyticsSales from '@/components/dashboard/analytics/sales';
import DashboardAnalyticsEarnings from '@/components/dashboard/analytics/earnings';

export const revalidate = 0;

const DashboardAnalyticsPage = async () => {
  const session = await auth();
  const totalOrders = await db.query.orderProduct.findMany({
    orderBy: [desc(orderProduct.id)],
    limit: 10,
    with: {
      order: { with: { user: true } },
      product: true,
      productVariants: { with: { variantImages: true } },
    },
  });

  if (session?.user?.role !== 'admin') redirect('/');
  if (totalOrders.length === 0)
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Orders</CardTitle>
        </CardHeader>
      </Card>
    );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Analytics</CardTitle>
        <CardDescription>
          Check your sales, new customers and more
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col lg:flex-row gap-4">
        <DashboardAnalyticsSales totalOrders={totalOrders} />
        <DashboardAnalyticsEarnings totalOrders={totalOrders} />
      </CardContent>
    </Card>
  );
};

export default DashboardAnalyticsPage;
