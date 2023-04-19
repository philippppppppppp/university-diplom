import { createContext, useState, PropsWithChildren, useContext } from "react";

type Language = string;

interface Context {
  selectedLanguage: Language;
  selectLanguage: (language: Language) => void;
  t: (key: string) => string;
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

  const t = function (key: string) {
    const selectedLanguageTranslations: any =
      translations[selectedLanguage] ?? {};
    const translationByKey = selectedLanguageTranslations[key];
    return typeof translationByKey === "string" ? translationByKey : "";
  };

  return (
    <context.Provider value={{ selectedLanguage, selectLanguage, t }}>
      {children}
    </context.Provider>
  );
};

export const useTranslation = () => useContext(context);
