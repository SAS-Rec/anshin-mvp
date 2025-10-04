import { Globe, Check } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';

const languages = [
  { code: 'English', flag: '🇬🇧', name: 'English' },
  { code: 'Japanese', flag: '🇯🇵', name: '日本語' },
  { code: 'Spanish', flag: '🇪🇸', name: 'Español' },
  { code: 'French', flag: '🇫🇷', name: 'Français' },
  { code: 'German', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'Chinese', flag: '🇨🇳', name: '中文' },
  { code: 'Korean', flag: '🇰🇷', name: '한국어' },
  { code: 'Portuguese', flag: '🇧🇷', name: 'Português' },
  { code: 'Russian', flag: '🇷🇺', name: 'Русский' },
  { code: 'Hindi', flag: '🇮🇳', name: 'हिन्दी' },
  { code: 'Arabic', flag: '🇸🇦', name: 'العربية' },
];

export function LanguageSwitcher() {
  const { language, setLanguage, detectedCountry } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {languages.find(l => l.code === language)?.flag || '🌐'}
          </span>
          {detectedCountry && (
            <span className="text-xs opacity-60">({detectedCountry})</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </span>
            {language === lang.code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
