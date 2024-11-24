'use client';

import { Globe } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../ui/dropdown-menu';
import { replaceLocaleInUrl } from '@/lib/replaceLocaleInUrl';
import { localesLanguageMap } from '@/maps/localeLanguageMap';

const LanguageDropdown: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (locale: string) => () => {
    router.push(replaceLocaleInUrl(pathname, locale));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(localesLanguageMap).map(([locale, language]) => (
          <DropdownMenuItem onClick={handleLanguageChange(locale)} key={locale}>
            {language}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;
