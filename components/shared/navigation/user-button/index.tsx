'use client';

import { useState } from 'react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { LogOut, Moon, Settings, Sun, TruckIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const NavUserButton = ({ user }: Session) => {
  const [checked, setChecked] = useState(false);
  const { setTheme, theme } = useTheme();

  const handleModeState = () => {
    switch (theme) {
      case 'dark':
        return setChecked(true);
      case 'light':
        return setChecked(false);
      case 'system':
        return setChecked(false);
    }
  };

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
        <DropdownMenuItem className="group py-2 font-medium cursor-pointer transition-all duration-500 ease-in-out">
          <TruckIcon
            size={14}
            className="mr-3 group-hover:translate-x-1 transition-all duration-300 ease-in-out"
          />{' '}
          My Orders
        </DropdownMenuItem>
        <DropdownMenuItem className="group py-2 font-medium cursor-pointer transition-all duration-500 ease-in-out">
          <Settings
            size={14}
            className="mr-3 group-hover:rotate-180 transition-all duration-300 ease-in-out"
          />
          Settings
        </DropdownMenuItem>
        {theme && (
          <DropdownMenuItem className="py-2 font-medium cursor-pointer transition-all duration-500 ease-in-out">
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 group"
            >
              {theme === 'dark' ? (
                <Moon
                  size={14}
                  className="group-hover:text-blue-400 group-hover:scale-125 transition-all duration-500 ease-in-out"
                />
              ) : (
                <Sun
                  size={14}
                  className="group-hover:text-yellow-600 group-hover:rotate-180 transition-all duration-500 ease-in-out"
                />
              )}

              <p className="dark:text-blue-400 text-secondary-foreground/75 ml-[10px] text-yellow-600">
                {theme[0].toUpperCase() + theme.slice(1)} Mode
              </p>
              <Switch
                className="scale-75 ml-4"
                checked={checked}
                onCheckedChange={(e) => {
                  setChecked((prev) => !prev);
                  e ? setTheme('dark') : setTheme('light');
                }}
              />
            </div>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={handleSignout}
          className="group py-2 font-medium cursor-pointer transition-all duration-500 ease-in-out focus:bg-destructive/50"
        >
          <LogOut
            size={14}
            className="mr-3 group-hover:scale-75 transition-all duration-300 ease-in-out"
          />{' '}
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavUserButton;
