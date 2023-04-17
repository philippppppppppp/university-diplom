import { ChakraProvider } from "@chakra-ui/react";
import { Routing } from "../pages";

export const App: React.FC = () => {
  return (
    <ChakraProvider resetCSS>
      <Routing />
    </ChakraProvider>
  );
};
