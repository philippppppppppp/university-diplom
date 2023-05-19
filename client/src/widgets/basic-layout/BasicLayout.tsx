import { PropsWithChildren, FC } from "react";
import { Header } from "./components/header";
import { Container } from "../../shared/ui";

export const BasicLayout: FC<PropsWithChildren> = ({ children }) => (
  <>
    <Header />
    <Container minH={{ base: "calc(100vh - 75px)", md: "calc(100vh - 80px)" }}>
      {children}
    </Container>
  </>
);
