import { ApiProvider } from "./api";
import { TranslationsProvider } from "./translations";
import { Compose } from "../../shared/compose";
import { PropsWithChildren, FC } from "react";
import { StylesProvider } from "./styles";

export const ComposedProviders: FC<PropsWithChildren> = ({ children }) => (
  <Compose components={[ApiProvider, TranslationsProvider, StylesProvider]}>
    {children}
  </Compose>
);
