import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@chakra-ui/react";
import { MinusIcon, StarIcon } from "@chakra-ui/icons";
import { useApi } from "../../shared/api";
import { gql } from "graphql-request";
import { useAuth } from "../../shared/auth";
import { useTranslation } from "../../shared/translations";
import { useViewer } from "../../entities/viewer";

const query = gql`
  mutation ($userId: uuid!, $favorites: _uuid) {
    update_users_by_pk(
      pk_columns: { id: $userId }
      _set: { favorites: $favorites }
    ) {
      favorites
    }
  }
`;

const useUpdateFavorites = () => {
  const client = useQueryClient();
  const { userId } = useAuth();
  const { request } = useApi();
  return useMutation(
    async (favorites: string[]) => {
      return await request({
        query,
        variables: {
          userId,
          favorites: `{${favorites.join(", ")}}`,
        },
        role: "user",
      });
    },
    {
      onSuccess() {
        client.invalidateQueries(["viewer", userId]);
      },
    }
  );
};

interface Props {
  id?: string;
}

export const FavoritesButton: React.FC<Props> = ({ id }) => {
  const { data: viewer } = useViewer();
  const { t } = useTranslation();
  const { mutate } = useUpdateFavorites();

  const favorite = viewer?.favorites.some((f) => f === id);

  const handleClick = () => {
    if (!viewer || !id) {
      return;
    }
    if (favorite) {
      mutate(viewer.favorites.filter((f) => f !== id));
    }
    const set = new Set([...viewer.favorites, id]);
    mutate(Array.from(set));
  };

  if (favorite) {
    return (
      <Button leftIcon={<MinusIcon />} onClick={handleClick}>
        {t("fromFavorites")}
      </Button>
    );
  }

  return (
    <Button leftIcon={<StarIcon />} onClick={handleClick}>
      {t("toFavorites")}
    </Button>
  );
};
