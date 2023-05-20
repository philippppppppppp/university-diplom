import { FC, PropsWithChildren } from "react";
import { Flex, Box, Slide, useColorMode, Show } from "@chakra-ui/react";
import { Container } from "../ui";
import { useInView } from "react-intersection-observer";

interface Props {
  renderFilters(): JSX.Element;
}

export const List: FC<PropsWithChildren<Props>> = ({
  renderFilters,
  children,
}) => {
  const { ref: filtersRef, inView: filtersInView } = useInView();
  const { colorMode } = useColorMode();
  return (
    <>
      <Flex pb="4" gap="4" wrap="wrap" ref={filtersRef}>
        {renderFilters()}
      </Flex>
      <Show above="md">
        <Box zIndex="1" left="0" right="0" top="0" pos="fixed">
          <Slide direction="top" in={!filtersInView}>
            <Flex
              gap="4"
              wrap="wrap"
              as={Container}
              rounded="md"
              shadow="md"
              bgColor={colorMode === "dark" ? "gray.600" : "gray.100"}
            >
              {renderFilters()}
            </Flex>
          </Slide>
        </Box>
      </Show>
      <Flex gap="4" direction="column">
        {children}
      </Flex>
    </>
  );
};
