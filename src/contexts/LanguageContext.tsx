import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  translate: (text: string) => Promise<string>;
  isTranslating: boolean;
  detectedCountry: string | null;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const countryToLanguage: Record<string, string> = {
  'JP': 'Japanese',
  'NG': 'English',
  'US': 'English',
  'GB': 'English',
  'FR': 'French',
  'DE': 'German',
  'ES': 'Spanish',
  'IT': 'Italian',
  'CN': 'Chinese',
  'KR': 'Korean',
  'BR': 'Portuguese',
  'RU': 'Russian',
  'IN': 'Hindi',
  'SA': 'Arabic',
  'MX': 'Spanish',
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<string>('English');
  const [isTranslating, setIsTranslating] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
  const [translationCache] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Request geolocation permission
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          });
        });

        // Use reverse geocoding to get country
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
        );
        const data = await response.json();
        const countryCode = data.address?.country_code?.toUpperCase();
        
        if (countryCode) {
          setDetectedCountry(countryCode);
          const detectedLang = countryToLanguage[countryCode] || 'English';
          
          if (detectedLang !== 'English') {
            toast.success(`Detected location: ${data.address?.country || countryCode}. Switching to ${detectedLang}.`);
            setLanguageState(detectedLang);
          }
        }
      } catch (error) {
        console.log('Location detection skipped or denied');
        toast.info('Location access denied. Using English by default.');
      }
    };

    detectLocation();
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    toast.success(`Language changed to ${lang}`);
  };

  const translate = async (text: string): Promise<string> => {
    if (language === 'English' || !text) return text;

    const cacheKey = `${text}_${language}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    setIsTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate', {
        body: { text, targetLanguage: language }
      });

      if (error) throw error;

      const translated = data.translatedText || text;
      translationCache.set(cacheKey, translated);
      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate, isTranslating, detectedCountry }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
