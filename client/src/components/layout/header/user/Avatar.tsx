import { Avatar as BaseAvatar, AvatarFallback } from '@/components/ui/avatar';

const Avatar: React.FC = () => {
  return (
    <BaseAvatar className="h-10 w-10">
      <AvatarFallback className="text-base">S</AvatarFallback>
    </BaseAvatar>
  );
};

export default Avatar;
