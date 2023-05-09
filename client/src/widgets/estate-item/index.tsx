import { useEstate } from "../../entities/estate/hooks";
import { UserCard } from "../../entities/user";
import { EstateDetails } from "../../entities/estate/ui";
import { Box, Flex } from "@chakra-ui/react";
import { useAuth } from "../../shared/auth";

interface Props {
  id?: string;
}

export const EstateItem: React.FC<Props> = ({ id }) => {
  const { data, isSuccess } = useEstate(id);
  const { userId } = useAuth();

  if (!isSuccess) {
    return null;
  }

  const { author, ...details } = data;
  const isAuthor = author?.id === userId;

  return (
    <Flex direction="column" gap="8">
      <EstateDetails details={details} isAuthor={isAuthor} />
      {!isAuthor && (
        <Box pr={{ base: "0", md: "200px" }}>
          <UserCard user={author} />
        </Box>
      )}
    </Flex>
  );
};
