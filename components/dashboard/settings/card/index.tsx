'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import DashboardSettingsForm from '../../forms/settings';
import { UserType } from '@/types/@types/user';

const DashboardSettingsCard = (user: UserType) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Settings</CardTitle>
        <CardDescription>Update your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <DashboardSettingsForm {...user} />
      </CardContent>
    </Card>
  );
};

export default DashboardSettingsCard;
