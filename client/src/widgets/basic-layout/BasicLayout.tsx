import { PropsWithChildren, FC } from "react";
import { Header } from "./components/header";
import { Container, Footer } from "../../shared/ui";
import { Flex } from "@chakra-ui/react";

export const BasicLayout: FC<PropsWithChildren> = ({ children }) => (
  <Flex minH="100vh" direction="column">
    <Header />
    <Container flexGrow="1">{children}</Container>
    <Footer />
  </Flex>
);
