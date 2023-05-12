import { useEstate } from "../../entities/estate/hooks";
import { UserCard } from "../../entities/user";
import { EstateDetails } from "../../entities/estate/ui";
import { Box, Flex, Button } from "@chakra-ui/react";
import { useAuth } from "../../shared/auth";
import { FavoritesButton } from "../../features/favorites-button";
import { useTranslation } from "../../shared/translations";
import { EditIcon } from "@chakra-ui/icons";

interface Props {
  id?: string;
}

export const EstateItem: React.FC<Props> = ({ id }) => {
  const { data, isSuccess } = useEstate(id);
  const { userId, authenticated } = useAuth();
  const { t } = useTranslation();

  if (!isSuccess) {
    return null;
  }

  const { author, ...details } = data;
  const isAuthor = author?.id === userId;

  let action: null | JSX.Element = null;
  if (authenticated) {
    if (userId !== author.id) {
      action = <FavoritesButton id={id} />;
    } else {
      action = <Button leftIcon={<EditIcon />}>{t("edit")}</Button>;
    }
  }

  return (
    <Flex direction="column" gap="8">
      <EstateDetails details={details} isAuthor={isAuthor} action={action} />
      {!isAuthor && (
        <Box pr={{ base: "0", md: "200px" }}>
          <UserCard user={author} />
        </Box>
      )}
    </Flex>
  );
};
