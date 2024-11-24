import Register from './actions/Register';
import SignIn from './actions/SignIn';
import LanguageDropdown from './language/LanguageDropdown';
import ThemeToggle from './theme/ThemeToggle';
import DropdownMenu from './user/DropdownMenu';

const DesktopNav: React.FC = () => {
  const user = { name: 'John Doe' };
  // const user = null;
  return (
    <div className="space-x-2 hidden sm:flex">
      <LanguageDropdown />
      <ThemeToggle />
      {!!user ? (
        <DropdownMenu />
      ) : (
        <>
          <SignIn />
          <Register />
        </>
      )}
    </div>
  );
};

export default DesktopNav;
