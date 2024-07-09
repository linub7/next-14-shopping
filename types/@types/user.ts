export type UserType = {
  email?: string | undefined | null;
  id: string;
  image?: string;
  isTwoFactorEnabled?: boolean;
  isOAuth?: boolean;
  name?: string | undefined | null;
  role: string;
};
