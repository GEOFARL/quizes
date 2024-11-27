import { getLocale, getTranslation } from "@/app/[locale]/dictionaries";
import Link from "next/link";
import MaxWidthWrapper from "../../utils/MaxWidthWrapper";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

const Header: React.FC = async () => {
  const translation = await getTranslation();
  const locale = getLocale();
  return (
    <header className="inset-x-0 top-0 z-20 h-16 bg-black/15 backdrop-blur-xl border-b border-black/5">
      <MaxWidthWrapper className="h-full flex items-center justify-between font-bold text-xl sm:text-2xl">
        <Link href={`/${locale}`}>{translation.home.title}</Link>

        <DesktopNav />
        <MobileNav />
      </MaxWidthWrapper>
    </header>
  );
};

export default Header;
