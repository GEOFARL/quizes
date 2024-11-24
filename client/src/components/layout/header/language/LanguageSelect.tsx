'use client';

import { useTranslation } from '@/components/providers/TranslationProvider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { replaceLocaleInUrl } from '@/lib/replaceLocaleInUrl';
import { localesLanguageMap } from '@/maps/localeLanguageMap';
import { Globe } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const LanguageSelect: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const translation = useTranslation();

  const handleLanguageChange = (locale: string) => {
    router.push(replaceLocaleInUrl(pathname, locale));
  };

  return (
    <Select
      onValueChange={(locale) => {
        handleLanguageChange(locale);
      }}
      defaultValue={pathname.split('/')[1]}
    >
      <SelectTrigger className="w-full">
        <div className="flex items-center gap-2">
          <Globe className="size-4" />
          {translation?.global.language}
        </div>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(localesLanguageMap).map(([locale, language]) => (
          <SelectItem value={locale} key={locale}>
            {language}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelect;
