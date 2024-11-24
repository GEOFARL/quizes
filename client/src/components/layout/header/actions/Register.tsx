'use client';
import { useTranslation } from '@/components/providers/TranslationProvider';
import { Button, ButtonProps } from '@/components/ui/button';

const Register: React.FC<ButtonProps> = ({ className }) => {
  const translation = useTranslation();
  return (
    <Button className={className}>{translation?.global.auth.signUp}</Button>
  );
};

export default Register;
