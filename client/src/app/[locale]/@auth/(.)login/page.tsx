import LoginDialog from "@/components/auth/LoginDialog";
import { Locale } from "@/types/locale";
import { getDictionary } from "../../dictionaries";

type Props = {
  params: Promise<{ locale: Locale }>;
};

const Page: React.FC<Props> = async ({ params }) => {
  const { locale } = await params;
  const translation = await getDictionary(locale);
  return <LoginDialog translation={translation} />;
};

export default Page;
