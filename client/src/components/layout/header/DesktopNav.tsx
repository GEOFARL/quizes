import { Dictionary } from "@/types/dictionary";
import Register from "./actions/Register";
import SignIn from "./actions/SignIn";
import LanguageDropdown from "./language/LanguageDropdown";
import ThemeToggle from "./theme/ThemeToggle";
import DropdownMenu from "./user/DropdownMenu";

type Props = {
  user?: string;
  translation: Dictionary;
};

const DesktopNav: React.FC<Props> = async ({ user, translation }) => {
  return (
    <div className="space-x-2 hidden sm:flex">
      <LanguageDropdown />
      <ThemeToggle />
      {!!user ? (
        <DropdownMenu user={user} translation={translation} />
      ) : (
        <>
          <SignIn translation={translation} />
          <Register translation={translation} />
        </>
      )}
    </div>
  );
};

export default DesktopNav;
