import { AlertCircleIcon } from 'lucide-react';

type Props = {
  message?: string;
};

const AuthFormErrorMessage = (props: Props) => {
  const { message } = props;
  if (!message) return null;
  return (
    <div className="bg-destructive/25 flex items-center gap-2 my-4 text-xs font-medium text-secondary-foreground p-3 rounded-md">
      <AlertCircleIcon className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
};

export default AuthFormErrorMessage;
