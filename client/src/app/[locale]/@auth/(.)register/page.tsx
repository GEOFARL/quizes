import RegisterDialog from "@/components/features/auth/RegisterDialog";
import { Locale } from "@/types/locale";
import { getDictionary } from "../../dictionaries";

type Props = {
  params: Promise<{ locale: Locale }>;
};

const Page: React.FC<Props> = async ({ params }) => {
  const { locale } = await params;
  const translation = await getDictionary(locale);
  return <RegisterDialog translation={translation} />;
};

export default Page;
