import { CheckCircle2 } from 'lucide-react';

type Props = {
  message?: string;
};

const FormSuccessMessage = (props: Props) => {
  const { message } = props;
  if (!message) return null;
  return (
    <div className="bg-teal-400/25 flex items-center gap-2 text-xs font-medium my-4 text-secondary-foreground p-3 rounded-md">
      <CheckCircle2 className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormSuccessMessage;
