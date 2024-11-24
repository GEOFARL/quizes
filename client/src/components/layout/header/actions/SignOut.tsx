'use client';
import { useTranslation } from '@/components/providers/TranslationProvider';
import { Button, ButtonProps } from '@/components/ui/button';
import { forwardRef, ForwardRefRenderFunction, Ref } from 'react';

const SignOut: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  { variant, ...props },
  ref: Ref<HTMLButtonElement>
) => {
  const translation = useTranslation();
  return (
    <Button
      {...props}
      className="w-full focus-visible:ring-transparent focus-visible:ring-offset-0"
      variant={variant ? variant : 'default'}
      ref={ref}
    >
      {translation?.global.auth.signOut}
    </Button>
  );
};

export default forwardRef(SignOut);
