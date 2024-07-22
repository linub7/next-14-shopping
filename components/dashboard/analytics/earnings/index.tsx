'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Bar, BarChart, ResponsiveContainer, Tooltip } from 'recharts';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TotalOrdersWithProductsDetails } from '@/lib/infer-type';
import { cn } from '@/lib/utils';
import { weeklyChart } from '@/lib/charts/weekly';
import { monthlyChart } from '@/lib/charts/monthly';

type Props = {
  totalOrders: TotalOrdersWithProductsDetails[];
};

const DashboardAnalyticsEarnings = (props: Props) => {
  const { totalOrders } = props;
  const router = useRouter();

  const searchParams = useSearchParams();
  const filter = searchParams.get('filter') || 'week';

  const chartItems = totalOrders?.map((tOrder) => ({
    date: tOrder.order.created!,
    revenue: tOrder.order.total,
  }));

  const activeChart = useMemo(() => {
    const weekly = weeklyChart(chartItems);
    const monthly = monthlyChart(chartItems);
    if (filter === 'week') return weekly;
    if (filter === 'month') return monthly;
  }, [filter]);

  const activeTotal = useMemo(() => {
    if (filter === 'month') {
      return monthlyChart(chartItems).reduce(
        (acc, item) => acc + item.revenue,
        0
      );
    } else {
      return weeklyChart(chartItems).reduce(
        (acc, item) => acc + item.revenue,
        0
      );
    }
  }, [filter]);

  const handleNavigate = (path: string) => router.push(path, { scroll: false });
  return (
    <Card className="flex-1 shrink-0 h-full">
      <CardHeader>
        <CardTitle>Your Revenue: ${activeTotal}</CardTitle>
        <CardDescription>Here are your recent Earnings</CardDescription>
        <div className="flex items-center gap-2">
          <Badge
            className={cn(
              'cursor-pointer',
              filter === 'week' ? 'bg-primary' : 'bg-primary/25'
            )}
            onClick={() => handleNavigate(`/dashboard/analytics?filter=week`)}
          >
            This week
          </Badge>
          <Badge
            className={cn(
              'cursor-pointer',
              filter === 'month' ? 'bg-primary' : 'bg-primary/25'
            )}
            onClick={() => handleNavigate(`/dashboard/analytics?filter=month`)}
          >
            This month
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer width={'100%'} height={'100%'}>
          <BarChart data={activeChart}>
            <Tooltip
              content={(props) => (
                <div>
                  {props.payload?.map((item) => (
                    <div
                      className="bg-primary py-2 px-4 rounded-md text-white"
                      key={item.payload.date}
                    >
                      <p>Revenue: ${item.value}</p>
                      <p>Date: {item.payload.date}</p>
                    </div>
                  ))}
                </div>
              )}
            />
            <Bar dataKey={'revenue'} className="fill-primary" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DashboardAnalyticsEarnings;
