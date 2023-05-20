import { Box, useColorMode } from "@chakra-ui/react";

export const Footer: React.FC = () => {
  const { colorMode } = useColorMode();
  return (
    <Box h="80px" bgColor={colorMode === "dark" ? "gray.600" : "gray.100"} />
  );
};
