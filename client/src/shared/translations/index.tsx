import { createContext, useState, PropsWithChildren, useContext } from "react";

type Language = string;

type TranslationKey = string;
interface InterpolationValues {
  [key: string]: string | number;
}

interface TranslationObject {
  key: TranslationKey;
  interpolations: InterpolationValues;
}

interface Context {
  selectedLanguage: Language;
  selectLanguage: (language: Language) => void;
  t(key: TranslationKey): string;
  t(translationObject: TranslationObject): string;
}

const context = createContext<Context>({
  selectedLanguage: "uk",
  selectLanguage: (language) => {},
  t: () => "",
});

interface Provider {
  initialLanguage: Language;
  translations: Record<Language, object>;
}

export const TranslationsProvider: React.FC<PropsWithChildren<Provider>> = ({
  children,
  translations,
  initialLanguage,
}) => {
  const [selectedLanguage, setSelectedLanguage] =
    useState<Language>(initialLanguage);

  const selectLanguage = (language: Language) => setSelectedLanguage(language);

  const t = (arg: TranslationObject | TranslationKey) => {
    const selectedLanguageTranslations: any =
      translations[selectedLanguage] ?? {};
    if (typeof arg === "string") {
      const key = arg;
      const translationByKey = selectedLanguageTranslations[key];
      if (typeof translationByKey !== "string") {
        return "";
      }
      return translationByKey;
    }
    const { key, interpolations } = arg;
    const translationByKey = selectedLanguageTranslations[key];
    if (typeof translationByKey !== "string") {
      return "";
    }
    return Object.entries(interpolations).reduce((acc, [key, value]) => {
      return acc.replace(`{{ ${key} }}`, String(value));
    }, translationByKey);
  };

  return (
    <context.Provider value={{ selectedLanguage, selectLanguage, t }}>
      {children}
    </context.Provider>
  );
};

export const useTranslation = () => useContext(context);
