import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { formatDistance, subMinutes } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
import { db } from '@/server';
import { auth } from '@/server/auth';
import { orders } from '@/server/schema';
import { Badge } from '@/components/ui/badge';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const DashboardOrdersPage = async () => {
  const session = await auth();
  if (!session) return redirect('/login');

  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userID, session.user.id),
    with: {
      orderProduct: {
        with: {
          product: true,
          productVariants: {
            with: {
              variantImages: true,
            },
          },
          order: true,
        },
      },
    },
  });
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Your Orders</CardTitle>
        <CardDescription>Check the status of your orders</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your recent orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userOrders?.map((uOrder) => (
              <TableRow key={uOrder.id}>
                <TableCell>{uOrder.id}</TableCell>
                <TableCell>${uOrder.total}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      uOrder?.status === 'succeeded'
                        ? 'bg-green-700 hover:bg-green-800'
                        : 'bg-yellow-700 hover:bg-yellow-800'
                    }
                  >
                    {uOrder.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs font-medium">
                  {formatDistance(subMinutes(uOrder?.created!, 0), new Date())}
                </TableCell>
                <TableCell>
                  <Dialog modal={false}>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant={'ghost'}>
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <DialogTrigger>
                            <Button variant={'ghost'} className="w-full">
                              View Details
                            </Button>
                          </DialogTrigger>
                        </DropdownMenuItem>
                        {uOrder.status === 'succeeded' && uOrder.receiptURL && (
                          <DropdownMenuItem>
                            <Button
                              asChild
                              variant={'ghost'}
                              className="w-full"
                            >
                              <Link href={uOrder.receiptURL} target="_blank">
                                Download receipt
                              </Link>
                            </Button>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent className="rounded-sm">
                      <DialogHeader>
                        <DialogTitle>Order Details #{uOrder.id}</DialogTitle>
                        <DialogDescription>
                          Your order total: ${uOrder.total}
                        </DialogDescription>
                      </DialogHeader>
                      <Card className="overflow-auto p-2 flex flex-col gap-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Image</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Product</TableHead>
                              <TableHead>Color</TableHead>
                              <TableHead>Quantity</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {uOrder?.orderProduct?.map(
                              ({ product, productVariants, quantity }) => (
                                <TableRow key={product?.id}>
                                  <TableCell>
                                    <Image
                                      src={productVariants.variantImages[0].url}
                                      alt={product.title}
                                      width={48}
                                      height={48}
                                    />
                                  </TableCell>
                                  <TableCell>${product.price}</TableCell>
                                  <TableCell>{product.title}</TableCell>
                                  <TableCell>
                                    <div
                                      className="w-4 h-4 rounded-full"
                                      style={{
                                        backgroundColor: `${productVariants.color}`,
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell className="text-base">
                                    {quantity}
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </Card>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DashboardOrdersPage;
