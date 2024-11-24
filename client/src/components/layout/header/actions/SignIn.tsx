'use client';
import { useTranslation } from '@/components/providers/TranslationProvider';
import { Button, ButtonProps } from '@/components/ui/button';

const SignIn: React.FC<ButtonProps> = ({ className }) => {
  const translation = useTranslation();
  return (
    <Button variant={'secondary'} className={className}>
      {translation?.global.auth.signIn}
    </Button>
  );
};

export default SignIn;
