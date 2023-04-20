import { PropsWithChildren, FC } from "react";
import { TranslationsProvider as TranslationsProviderLib } from "../../../shared/translations";
import translations from "./translations.json";

export const TranslationsProvider: FC<PropsWithChildren> = ({ children }) => (
  <TranslationsProviderLib translations={translations} initialLanguage="uk">
    {children}
  </TranslationsProviderLib>
);
