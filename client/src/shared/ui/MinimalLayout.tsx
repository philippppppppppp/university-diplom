import { FC, PropsWithChildren } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { MinimalHeader } from "./MinimalHeader";

export const MinimalLayout: FC<PropsWithChildren> = ({ children }) => (
  <>
    <Box position="absolute" left="0" right="0" top="0">
      <MinimalHeader />
    </Box>
    <Flex w="100%" h="100vh" alignItems="center" justifyContent="center" p="4">
      <Flex
        borderWidth="1px"
        borderRadius="md"
        p="4"
        direction="column"
        gap="2"
      >
        {children}
      </Flex>
    </Flex>
  </>
);
