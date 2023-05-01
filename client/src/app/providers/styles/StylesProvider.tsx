import { PropsWithChildren, FC } from "react";
import {
  ChakraProvider,
  ToastProviderProps,
  extendTheme,
} from "@chakra-ui/react";

const toastOptions: ToastProviderProps = {
  defaultOptions: { position: "top" },
};

const theme = extendTheme({
  styles: {
    global: {
      "html, body, #root": {
        minHeight: "100vh",
      },
    },
  },
});

export const StylesProvider: FC<PropsWithChildren> = ({ children }) => (
  <ChakraProvider resetCSS toastOptions={toastOptions} theme={theme}>
    {children}
  </ChakraProvider>
);
