import { Container } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Container maxW={1000} pt="4">
        {children}
      </Container>
    </>
  );
};
