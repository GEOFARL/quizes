import RegisterScreen from "@/components/screens/auth/Register";
import { getDictionary } from "../dictionaries";
import { Locale } from "@/types/locale";

type Props = {
  params: Promise<{ locale: Locale }>;
};

const Page: React.FC<Props> = async ({ params }) => {
  const { locale } = await params;
  const translation = await getDictionary(locale);
  return <RegisterScreen translation={translation} />;
};

export default Page;
