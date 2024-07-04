import { AlertCircleIcon } from 'lucide-react';

type Props = {
  message?: string;
};

const AuthFormErrorMessage = (props: Props) => {
  const { message } = props;
  if (!message) return null;
  return (
    <div className="bg-destructive text-secondary-foreground p-3 rounded-md">
      <AlertCircleIcon className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
};

export default AuthFormErrorMessage;
