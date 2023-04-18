import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { RouterProvider } from "react-router-dom";
import { router } from "../pages";
import { TranslationsProvider } from "../shared/translations";

const theme = extendTheme({
  colors: {
    brand: {},
  },
});

export const App: React.FC = () => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <TranslationsProvider>
        <RouterProvider router={router} />
      </TranslationsProvider>
    </ChakraProvider>
  );
};
