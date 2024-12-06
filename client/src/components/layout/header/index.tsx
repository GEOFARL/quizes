import { getDictionary } from "@/app/[locale]/dictionaries";
import { User } from "@/lib/user/user";
import { Locale } from "@/types/locale";
import { cookies } from "next/headers";
import Link from "next/link";
import MaxWidthWrapper from "../../utils/MaxWidthWrapper";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import NavLink from "@/components/common/NavLink";

type Props = {
  locale: Locale;
};

const Header: React.FC<Props> = async ({ locale }) => {
  const translation = await getDictionary(locale);
  const user = await User.fromCookies(await cookies());
  return (
    <header className="inset-x-0 top-0 z-20 h-16 bg-black/15 backdrop-blur-xl border-b border-black/5">
      <MaxWidthWrapper className="h-full flex items-center justify-between">
        <div className="space-x-6">
          <Link href={`/${locale}`} className="font-bold text-xl sm:text-2xl">
            {translation.home.title}
          </Link>

          <NavLink href={`/${locale}/quizzes`}>
            {translation.home.hero.nav.saved}
          </NavLink>
        </div>

        <DesktopNav user={user?.toString()} translation={translation} />
        <MobileNav user={user?.toString()} translation={translation} />
      </MaxWidthWrapper>
    </header>
  );
};

export default Header;
