'use client';

import { Dispatch, forwardRef, SetStateAction, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Input, InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Props = InputProps & {
  value: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
};

const AddVariantInputTags = forwardRef<HTMLInputElement, Props>(
  ({ value, onChange, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = useState('');
    const [focused, setFocused] = useState(false);

    const { setFocus } = useFormContext();

    const addPendingDataPoint = () => {
      if (pendingDataPoint) {
        const newDataPoints = new Set([...value, pendingDataPoint]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint('');
      }
    };
    return (
      <div
        className={cn(
          'flex min-h-[20px] w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          focused
            ? 'ring-offset-2 outline-none ring-ring ring-2'
            : 'ring-offset-0 outline-none ring-ring ring-0'
        )}
        onClick={() => setFocus('tags')}
      >
        <motion.div className="rounded-md min-h-[2.5rem] p-2 flex gap-2 flex-wrap items-center">
          <AnimatePresence>
            {value?.map((el) => (
              <motion.div
                key={el}
                animate={{ scale: 1 }}
                initial={{ scale: 0 }}
                exit={{ scale: 0 }}
              >
                <Badge variant={'secondary'}>
                  {el}
                  <button
                    className="w-3 ml-1"
                    onClick={() => onChange(value.filter((i) => i !== el))}
                  >
                    <XIcon className="w-3" />
                  </button>
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="flex">
            <Input
              placeholder="Add Tag"
              className="focus-visible:border-transparent border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addPendingDataPoint();
                }
                if (
                  e.key === 'Backspace' &&
                  !pendingDataPoint &&
                  value.length > 0
                ) {
                  e.preventDefault();
                  const newValue = [...value];
                  newValue.pop();
                  onChange(newValue);
                }
              }}
              value={pendingDataPoint}
              onFocus={(e) => setFocused(true)}
              onBlurCapture={(e) => setFocused(false)}
              onChange={(e) => setPendingDataPoint(e.target.value)}
              {...props}
            />
          </div>
        </motion.div>
      </div>
    );
  }
);

AddVariantInputTags.displayName = 'AddVariantInputTags';

export default AddVariantInputTags;
