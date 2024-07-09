import { Toggle } from '@/components/ui/toggle';

type Props = {
  pressed?: boolean;
  icon: JSX.Element;
  onPressedChange?(pressed: boolean): void;
};

const CustomToggle = (props: Props) => {
  const { pressed, icon, onPressedChange } = props;
  return (
    <Toggle pressed={pressed} onPressedChange={onPressedChange} size={'sm'}>
      {icon}
    </Toggle>
  );
};

export default CustomToggle;
