import { FC, useState } from "react";
import { useEstate } from "../../entities/estate/hooks";
import { UserCard } from "../../entities/user";
import { EstateItemInfo, UpdateEstateForm } from "../../entities/estate";
import { Box, Flex, Button } from "@chakra-ui/react";
import { useAuth } from "../../shared/auth";
import { FavoritesButton } from "../../features/favorites-button";
import { useTranslation } from "../../shared/translations";
import { EditIcon } from "@chakra-ui/icons";
import { Loader, LoadingError } from "../../shared/ui";

interface Props {
  id: string;
}

export const EstateItem: FC<Props> = ({ id }) => {
  const { data, isLoading, isError } = useEstate(id);
  const { userId, authenticated } = useAuth();
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <LoadingError />;
  }

  const { author, ...details } = data;
  const isAuthor = author?.id === userId;

  let action: null | JSX.Element = null;
  if (authenticated) {
    if (userId !== author.id) {
      action = <FavoritesButton id={id} />;
    } else {
      action = (
        <Button leftIcon={<EditIcon />} onClick={() => setEditMode(true)}>
          {t("edit")}
        </Button>
      );
    }
  }

  const disableEditMode = () => setEditMode(false);

  return (
    <Flex direction="column" gap="8">
      {editMode ? (
        <UpdateEstateForm
          id={id}
          onSuccess={disableEditMode}
          onCancel={disableEditMode}
        />
      ) : (
        <>
          <EstateItemInfo details={details} action={action} />
          {!isAuthor && (
            <Box pr={{ base: "0", md: "200px" }}>
              <UserCard user={author} />
            </Box>
          )}
        </>
      )}
    </Flex>
  );
};
