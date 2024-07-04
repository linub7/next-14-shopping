import { ReactNode } from 'react';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AuthSocials from '../socials';
import AuthBackButton from '../buttons/back';

type Props = {
  children: ReactNode;
  cardTitle: string;
  backButtonHref: string;
  backButtonLabel: string;
  showSocials?: boolean;
};

const AuthCard = (props: Props) => {
  const { children, cardTitle, backButtonHref, backButtonLabel, showSocials } =
    props;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocials && (
        <CardFooter>
          <AuthSocials />
        </CardFooter>
      )}
      <CardFooter>
        <AuthBackButton href={backButtonHref} label={backButtonLabel} />
      </CardFooter>
    </Card>
  );
};

export default AuthCard;
