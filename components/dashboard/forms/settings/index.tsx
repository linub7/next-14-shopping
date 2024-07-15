'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DashboardSettingsSchema } from '@/types/schemas/dashboard/settings';
import { Switch } from '@/components/ui/switch';
import FormErrorMessage from '@/components/shared/messages/error';
import FormSuccessMessage from '@/components/shared/messages/success';
import { updateSettings } from '@/server/actions/settings';
import { UserType } from '@/types/@types/user';
import { UploadButton } from '@/app/api/uploadthing/upload';

const DashboardSettingsForm = (user: UserType) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);

  const form = useForm<z.infer<typeof DashboardSettingsSchema>>({
    resolver: zodResolver(DashboardSettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      image: user?.image || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });

  const { execute, status } = useAction(updateSettings, {
    onSuccess(data) {
      if (data?.data?.error) {
        setError(data?.data?.error);
        setTimeout(() => {
          setError('');
        }, 3000);
      }
      if (data?.data?.success) {
        setSuccess(data?.data?.success);
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      }
    },
    onError() {
      setError('OOPS! something went wrong');
    },
  });

  const handleSubmit = (values: z.infer<typeof DashboardSettingsSchema>) =>
    execute(values);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="John Doe"
                    disabled={status === 'executing'}
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    autoComplete="email"
                    placeholder="johndoe@gmail.com"
                    disabled={status === 'executing' || user?.isOAuth}
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <div className="flex items-center gap-4">
                  {!form.getValues('image') && user.name && (
                    <div className="font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {form.getValues('image') && (
                    <Image
                      src={form.getValues('image')!}
                      alt="user image"
                      className="rounded-full"
                      width={42}
                      height={42}
                    />
                  )}
                  <UploadButton
                    className="scale-75 ut-button:ring-primary ut-button:bg-primary/75 hover:ut-button:bg-primary/100 ut-button:transition-all ut-button:duration-500 ut-label:hidden ut-allowed-content:hidden"
                    endpoint="avatarUploader"
                    content={{
                      button(ready) {
                        if (ready) return <div>Change Avatar</div>;
                        return <div>Uploading...</div>;
                      },
                    }}
                    onUploadBegin={() => setIsAvatarUploading(true)}
                    onUploadError={(error) => {
                      console.log({ error });
                      form.setError('image', {
                        type: 'validate',
                        message: error?.message,
                      });
                      setIsAvatarUploading(false);
                      return;
                    }}
                    onClientUploadComplete={(res) => {
                      form.setValue('image', res[0].url!);
                      setIsAvatarUploading(false);
                      return;
                    }}
                  />
                </div>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="User image"
                    type="hidden"
                    disabled={status === 'executing'}
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="current-password"
                    placeholder="******"
                    disabled={status === 'executing' || user?.isOAuth}
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="current-password"
                    placeholder="******"
                    disabled={status === 'executing' || user?.isOAuth}
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isTwoFactorEnabled"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Two Factor Authentication</FormLabel>
                <FormDescription>
                  Enabled two factor authentication for your account
                </FormDescription>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={status === 'executing' || user?.isOAuth}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
        <FormErrorMessage message={error} />
        <FormSuccessMessage message={success} />
        <Button
          type="submit"
          disabled={status === 'executing' || isAvatarUploading}
        >
          Update your settings
        </Button>
      </form>
    </Form>
  );
};

export default DashboardSettingsForm;
