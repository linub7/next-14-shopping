'use client';
import { Session } from 'next-auth';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import DashboardSettingsForm from '../../forms/settings';

const DashboardSettingsCard = (session: Session) => {
  const { expires, user } = session;
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
