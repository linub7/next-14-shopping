'use client';

import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { LogOut, Moon, Settings, Sun, TruckIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const NavUserButton = ({ user }: Session) => {
  const handleSignout = () => signOut();
  if (!user) return null;
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar>
          {user?.image && user?.name && (
            <Image
              className="rounded-full"
              src={user?.image}
              alt={user.name}
              fill={true}
            />
          )}
          {!user?.image && (
            <AvatarFallback className="bg-primary/25">
              <div className="font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-6" align="end">
        <div className="mb-4 p-4 flex flex-col gap-1 items-center rounded-lg bg-primary/10">
          {user?.image && user?.name && (
            <Image
              className="rounded-full"
              src={user?.image}
              alt={user.name}
              width={36}
              height={36}
            />
          )}
          <p className="font-bold text-xs">{user?.name}</p>
          <span className="text-xs font-medium text-secondary-foreground">
            {user?.email}
          </span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="group py-2 font-medium cursor-pointer transition-all duration-500">
          <TruckIcon
            size={14}
            className="mr-3 group-hover:translate-x-1 transition-all duration-300 ease-in-out"
          />{' '}
          My Orders
        </DropdownMenuItem>
        <DropdownMenuItem className="group py-2 font-medium cursor-pointer transition-all duration-500">
          <Settings
            size={14}
            className="mr-3 group-hover:rotate-180 transition-all duration-300 ease-in-out"
          />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="py-2 font-medium cursor-pointer transition-all duration-500">
          <div className="flex items-center gap-1">
            <Sun size={14} />
            <Moon size={14} />
            <p>
              Theme <span>theme</span>
            </p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleSignout}
          className="group py-2 font-medium cursor-pointer transition-all duration-500 focus:bg-destructive/50"
        >
          <LogOut
            size={14}
            className="mr-3 group-hover:scale-75 transition-all duration-300 ease-in-ou"
          />{' '}
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavUserButton;
