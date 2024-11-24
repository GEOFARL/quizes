import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import SignOut from '../actions/SignOut';
import UserInfo from './Info';

const Menu: React.FC = () => {
  return (
    <>
      <DropdownMenuLabel className="font-normal">
        <UserInfo />
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <SignOut variant={'ghost'} />
      </DropdownMenuItem>
    </>
  );
};

export default Menu;
