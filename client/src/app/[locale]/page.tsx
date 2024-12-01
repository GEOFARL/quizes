import HomeScreen from "@/components/screens/Home";
import { Locale } from "@/types/locale";
import { getDictionary } from "./dictionaries";
import { User } from "@/lib/user/user";
import { cookies } from "next/headers";

type Props = {
  params: Promise<{ locale: Locale }>;
};

const HomePage: React.FC<Props> = async ({ params }) => {
  const user = await User.fromCookies(await cookies());
  const { locale } = await params;
  const translation = await getDictionary(locale);
  return <HomeScreen translation={translation} user={user?.toString() ?? ""} />;
};

export default HomePage;
