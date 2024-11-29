import LoginScreen from "@/components/screens/auth/Login";
import { getDictionary } from "../dictionaries";
import { Locale } from "@/types/locale";

type Props = {
  params: Promise<{ locale: Locale }>;
};

const Page: React.FC<Props> = async ({ params }) => {
  const { locale } = await params;
  const translation = await getDictionary(locale);
  return <LoginScreen translation={translation} />;
};

export default Page;
