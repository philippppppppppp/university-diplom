import { PropsWithChildren, FC } from "react";
import { ChakraProvider } from "@chakra-ui/react";

export const StylesProvider: FC<PropsWithChildren> = ({ children }) => (
  <ChakraProvider resetCSS>{children}</ChakraProvider>
);
