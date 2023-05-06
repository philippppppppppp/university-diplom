import { useEstate } from "../../entities/estate/hooks";
import { UserCard } from "../../entities/user";
import { EstateDetails } from "../../entities/estate/ui";
import { Box, Flex } from "@chakra-ui/react";

interface Props {
  id?: string;
}

export const EstateItem: React.FC<Props> = ({ id }) => {
  const { data, isSuccess } = useEstate(id);

  if (!isSuccess) {
    return null;
  }

  const { author, ...details } = data;
  return (
    <Flex direction="column" gap="8">
      <EstateDetails {...details} />
      <Box pr={{ base: "0", md: "200px" }}>
        <UserCard {...author} />
      </Box>
    </Flex>
  );
};
