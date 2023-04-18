import { createContext, useState, PropsWithChildren, useContext } from "react";
import translations from "./translations.json";

type Language = "uk" | "ru";

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

export const TranslationsProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("uk");

  const selectLanguage = (language: Language) =>
    setSelectedLanguage((l) => (l === "uk" ? "ru" : "uk"));

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
