import { Gallery } from "../../shared/ui";
import { useEstate } from "../../entities/estate/hooks";
import { Flex, Box } from "@chakra-ui/react";
import { UserCard } from "../../entities/user";
import { EstateDetails } from "../../entities/estate/ui";

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
    <>
      {!!data.images?.length && (
        <Flex
          mt="2"
          direction={{ base: "column", md: "row" }}
          justifyContent="space-between"
        >
          <Box flexGrow="0" overflow="hidden">
            <Gallery images={data.images} />
          </Box>
          <Box width="200px" flexShrink="0"></Box>
        </Flex>
      )}
      <Flex
        pr={{ base: "0", md: "200px" }}
        direction="column"
        gap="4"
        pt="6"
        alignItems="stretch"
      >
        <EstateDetails {...details} />
        <Box alignSelf="stretch">
          <UserCard {...author} />
        </Box>
      </Flex>
    </>
  );
};
