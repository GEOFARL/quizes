import HomeScreen from "@/components/screens/Home";
import { Locale } from "@/types/locale";
import { getDictionary } from "./dictionaries";

type Props = {
  params: Promise<{ locale: Locale }>;
};

const HomePage: React.FC<Props> = async ({ params }) => {
  const { locale } = await params;
  const translation = await getDictionary(locale);
  return <HomeScreen translation={translation} />;
};

export default HomePage;
