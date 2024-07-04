import { CheckCircle2 } from 'lucide-react';

type Props = {
  message?: string;
};

const AuthFormSuccessMessage = (props: Props) => {
  const { message } = props;
  if (!message) return null;
  return (
    <div className="bg-teal-400 text-secondary-foreground p-3 rounded-md">
      <CheckCircle2 className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
};

export default AuthFormSuccessMessage;
