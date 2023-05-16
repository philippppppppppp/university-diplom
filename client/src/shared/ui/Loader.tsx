import { Flex, Spinner } from "@chakra-ui/react";

interface Props {
  h?: string;
}

export const Loader: React.FC<Props> = ({ h = "300px" }) => (
  <Flex h={h} justifyContent="center" alignItems="center">
    <Spinner />
  </Flex>
);
