import { PropsWithChildren, FC } from "react";
import { Container as ContainerUi, ContainerProps } from "@chakra-ui/react";

export const Container: FC<PropsWithChildren<ContainerProps>> = ({
  children,
  ...props
}) => (
  <>
    <ContainerUi maxW={1000} py="4" {...props}>
      {children}
    </ContainerUi>
  </>
);
