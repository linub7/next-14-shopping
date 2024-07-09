'use client';

import DashboardAddProductForm from '@/components/dashboard/forms/add-product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {};

const DashboardAddProductCard = (props: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Product</CardTitle>
      </CardHeader>
      <CardContent>
        <DashboardAddProductForm />
      </CardContent>
    </Card>
  );
};

export default DashboardAddProductCard;
