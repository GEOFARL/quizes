import { User } from "@/lib/user/user";
import { cookies } from "next/headers";
import Register from "./actions/Register";
import SignIn from "./actions/SignIn";
import LanguageDropdown from "./language/LanguageDropdown";
import ThemeToggle from "./theme/ThemeToggle";
import DropdownMenu from "./user/DropdownMenu";

const DesktopNav: React.FC = async () => {
  const user = await User.fromCookies(await cookies());
  return (
    <div className="space-x-2 hidden sm:flex">
      <LanguageDropdown />
      <ThemeToggle />
      {!!user ? (
        <DropdownMenu user={user.toString()} />
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
