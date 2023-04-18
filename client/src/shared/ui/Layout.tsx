import { Container } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { Header } from "./Header";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header />
      <Container maxW={1000}>{children}</Container>
    </>
  );
};
