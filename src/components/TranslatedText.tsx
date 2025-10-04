import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from './ui/skeleton';

interface TranslatedTextProps {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export function TranslatedText({ text, as: Component = 'span', className }: TranslatedTextProps) {
  const { translate, language, isTranslating } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const performTranslation = async () => {
      if (language === 'English') {
        setTranslatedText(text);
        return;
      }

      setLoading(true);
      const result = await translate(text);
      if (mounted) {
        setTranslatedText(result);
        setLoading(false);
      }
    };

    performTranslation();

    return () => {
      mounted = false;
    };
  }, [text, language, translate]);

  if (loading) {
    return <Skeleton className={`h-4 w-full ${className}`} />;
  }

  return <Component className={className}>{translatedText}</Component>;
}
