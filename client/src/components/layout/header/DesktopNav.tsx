import Register from "./actions/Register";
import SignIn from "./actions/SignIn";
import LanguageDropdown from "./language/LanguageDropdown";
import ThemeToggle from "./theme/ThemeToggle";
import DropdownMenu from "./user/DropdownMenu";

type Props = {
  user?: string;
};

const DesktopNav: React.FC<Props> = async ({ user }) => {
  return (
    <div className="space-x-2 hidden sm:flex">
      <LanguageDropdown />
      <ThemeToggle />
      {!!user ? (
        <DropdownMenu user={user} />
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
