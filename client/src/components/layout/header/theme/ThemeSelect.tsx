'use client';

import { useTranslation } from '@/components/providers/TranslationProvider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const ThemeSelect: React.FC = () => {
  const { setTheme, theme } = useTheme();
  const translation = useTranslation();

  return (
    <Select
      onValueChange={(value) => {
        setTheme(value);
      }}
      defaultValue={theme}
    >
      <SelectTrigger className="w-full">
        <div className="flex items-center gap-2">
          {theme === 'light' ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
          {translation?.global.theme.name}
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">{translation?.global.theme.light}</SelectItem>
        <SelectItem value="dark">{translation?.global.theme.dark}</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ThemeSelect;
