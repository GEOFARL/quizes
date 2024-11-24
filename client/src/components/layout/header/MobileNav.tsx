import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Register from './actions/Register';
import SignIn from './actions/SignIn';
import SignOut from './actions/SignOut';
import LanguageSelect from './language/LanguageSelect';
import ThemeSelect from './theme/ThemeSelect';
import UserInfo from './user/Info';

const MobileNav: React.FC = () => {
  const user = true;
  return (
    <Sheet>
      <SheetTrigger asChild className="block sm:hidden">
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetTitle></SheetTitle>
        <SheetDescription></SheetDescription>
        <div className="flex flex-col justify-between gap-2 py-6 h-full">
          <div className="flex flex-col gap-4">
            {!!user && <UserInfo />}
            <ThemeSelect />
            <LanguageSelect />
          </div>

          {!user ? (
            <div className="flex flex-col gap-2 w-full">
              <SignIn className="flex-1" />
              <Register className="flex-1" />
            </div>
          ) : (
            <SignOut />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
