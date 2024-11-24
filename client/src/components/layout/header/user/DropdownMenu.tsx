'use client';
import {
  DropdownMenu as BaseDropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../../../ui/dropdown-menu';
import UserAvatar from '../user/Avatar';
import UserMenu from './Menu';

const DropdownMenu: React.FC = () => {
  return (
    <BaseDropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56" forceMount>
        {<UserMenu />}
      </DropdownMenuContent>
    </BaseDropdownMenu>
  );
};

export default DropdownMenu;
