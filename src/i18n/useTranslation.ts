import { translations, TranslationKeys } from './translations';
import { useCalculatorStore } from '../store/calculatorStore';

/**
 * Returns the translation object for the current language setting.
 * Usage:
 *   const t = useTranslation();
 *   <Text>{t.settings}</Text>
 */
export function useTranslation(): TranslationKeys {
  const language = useCalculatorStore((s) => s.settings.language);
  return translations[language] ?? translations.en;
}
