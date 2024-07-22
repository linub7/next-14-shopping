import Image from 'next/image';

import placeholderUser from '@/public/user_placeholder.png';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TotalOrdersWithProductsDetails } from '@/lib/infer-type';

type Props = {
  totalOrders: TotalOrdersWithProductsDetails[];
};

const DashboardAnalyticsSales = (props: Props) => {
  const { totalOrders } = props;
  return (
    <Card className="flex-1 shrink-0">
      <CardHeader>
        <CardTitle>New Sales</CardTitle>
        <CardDescription>Here are your recent Sales</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption></TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {totalOrders?.map((tOrder) => (
              <TableRow className="font-medium" key={tOrder.order.id}>
                <TableCell>
                  {tOrder.order.user && tOrder.order.user.name ? (
                    <div className="flex flex-col w-32 gap-2">
                      {tOrder.order.user.image && (
                        <Image
                          src={tOrder.order.user.image}
                          alt={tOrder.order.user.name}
                          width={25}
                          height={25}
                          className="rounded-full"
                        />
                      )}
                      <p className="text-xs font-medium">
                        {tOrder.order.user.name}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 items-center justify-center">
                      <Image
                        src={placeholderUser}
                        alt={'user not found'}
                        width={25}
                        height={25}
                        className="rounded-full"
                      />
                      <p className="text-xs font-medium">User not found</p>
                    </div>
                  )}
                </TableCell>
                <TableCell>{tOrder.product.title}</TableCell>
                <TableCell>${tOrder.product.price}</TableCell>
                <TableCell>{tOrder.quantity}</TableCell>
                <TableCell>
                  <Image
                    alt={tOrder.product.title}
                    src={tOrder.productVariants.variantImages[0].url}
                    width={48}
                    height={48}
                    className="rounded-md"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DashboardAnalyticsSales;
