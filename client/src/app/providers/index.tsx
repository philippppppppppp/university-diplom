import { ApiProvider } from "./api";
import { TranslationsProvider } from "./translations";
import { Compose } from "../../shared/compose";
import { PropsWithChildren, FC } from "react";
import { StylesProvider } from "./styles";
import { AuthProvider } from "./auth";

export const ComposedProviders: FC<PropsWithChildren> = ({ children }) => (
  <Compose
    components={[
      AuthProvider,
      ApiProvider,
      TranslationsProvider,
      StylesProvider,
    ]}
  >
    {children}
  </Compose>
);
