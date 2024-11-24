import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

type Props = {
  className?: string;
} & PropsWithChildren;

const MaxWidthWrapper: React.FC<Props> = ({ children, className }) => {
  return (
    <div className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
