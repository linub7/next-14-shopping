'use client';
import { useSearchParams } from 'next/navigation';

import DashboardAddProductForm from '@/components/dashboard/forms/add-product';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type Props = {};

const DashboardAddProductCard = (props: Props) => {
  const searchParams = useSearchParams();

  const editMode = searchParams.get('id');
  return (
    <Card>
      <CardHeader>
        <CardTitle> {editMode ? 'Update Product' : 'Create Product'}</CardTitle>
        <CardDescription>
          {editMode
            ? 'Make changes to existing product'
            : 'Add a brand new product'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DashboardAddProductForm editMode={editMode} />
      </CardContent>
    </Card>
  );
};

export default DashboardAddProductCard;
