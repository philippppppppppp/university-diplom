import { PropsWithChildren, FC } from "react";
import { ChakraProvider, ToastProviderProps } from "@chakra-ui/react";

const toastOptions: ToastProviderProps = {
  defaultOptions: { position: "top" },
};

export const StylesProvider: FC<PropsWithChildren> = ({ children }) => (
  <ChakraProvider resetCSS toastOptions={toastOptions}>
    {children}
  </ChakraProvider>
);
