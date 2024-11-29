import { getDictionary } from "@/app/[locale]/dictionaries";
import { User } from "@/lib/user/user";
import { Locale } from "@/types/locale";
import { cookies } from "next/headers";
import Link from "next/link";
import MaxWidthWrapper from "../../utils/MaxWidthWrapper";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

type Props = {
  locale: Locale;
};

const Header: React.FC<Props> = async ({ locale }) => {
  const translation = await getDictionary(locale);
  const user = await User.fromCookies(await cookies());
  return (
    <header className="inset-x-0 top-0 z-20 h-16 bg-black/15 backdrop-blur-xl border-b border-black/5">
      <MaxWidthWrapper className="h-full flex items-center justify-between font-bold text-xl sm:text-2xl">
        <Link href={`/${locale}`}>{translation.home.title}</Link>

        <DesktopNav user={user?.toString()} translation={translation} />
        <MobileNav user={user?.toString()} translation={translation} />
      </MaxWidthWrapper>
    </header>
  );
};

export default Header;
