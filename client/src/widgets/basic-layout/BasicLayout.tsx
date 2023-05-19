import { PropsWithChildren, FC } from "react";
import { Header } from "./components/header";
import { Container } from "@chakra-ui/react";

export const BasicLayout: FC<PropsWithChildren> = ({ children }) => (
  <>
    <Header />
    <Container
      maxW={1000}
      py="4"
      minH={{ base: "calc(100vh - 75px)", md: "calc(100vh - 80px)" }}
    >
      {children}
    </Container>
  </>
);
