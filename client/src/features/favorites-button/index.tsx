import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@chakra-ui/react";
import { MinusIcon, StarIcon } from "@chakra-ui/icons";
import { useApi } from "../../shared/api";
import { gql } from "graphql-request";
import { useAuth } from "../../shared/auth";
import { useTranslation } from "../../shared/translations";

const favoritesQuery = gql`
  query ($estateId: uuid!, $userId: uuid!) {
    favorites(
      where: {
        _and: { estate_id: { _eq: $estateId }, user_id: { _eq: $userId } }
      }
    ) {
      id
    }
  }
`;

const useFavorite = (estateId: string) => {
  const { request } = useApi();
  const { userId } = useAuth();
  return useQuery(["favorite", { userId, estateId }], async () => {
    const { favorites } = await request<{ favorites: { id: string }[] }>({
      query: favoritesQuery,
      variables: {
        userId,
        estateId,
      },
      role: "user",
    });
    return favorites.length > 0;
  });
};

const addToFavoritesQuery = gql`
  mutation ($estateId: uuid!, $userId: uuid!) {
    insert_favorites_one(object: { estate_id: $estateId, user_id: $userId }) {
      estate_id
    }
  }
`;

const useAddToFavorites = () => {
  const client = useQueryClient();
  const { userId } = useAuth();
  const { request } = useApi();
  return useMutation(
    async (estateId: string) => {
      const { insert_favorites_one } = await request<{
        insert_favorites_one: { estate_id: string };
      }>({
        query: addToFavoritesQuery,
        variables: {
          userId,
          estateId,
        },
        role: "user",
      });
      return insert_favorites_one;
    },
    {
      onSuccess({ estate_id }) {
        client.invalidateQueries(["estate-favorites-list"]);
        client.invalidateQueries(["favorite", { userId, estateId: estate_id }]);
      },
    }
  );
};

const removeFromFavoritesQuery = gql`
  mutation ($estateId: uuid!, $userId: uuid!) {
    delete_favorites(
      where: {
        _and: { estate_id: { _eq: $estateId }, user_id: { _eq: $userId } }
      }
    ) {
      returning {
        estate_id
      }
    }
  }
`;

const useRemoveFromFavorites = () => {
  const client = useQueryClient();
  const { userId } = useAuth();
  const { request } = useApi();
  return useMutation(
    async (estateId: string) => {
      const { delete_favorites } = await request<{
        delete_favorites: { returning: { estate_id: string }[] };
      }>({
        query: removeFromFavoritesQuery,
        variables: {
          userId,
          estateId,
        },
        role: "user",
      });
      return delete_favorites.returning[0];
    },
    {
      onSuccess({ estate_id }) {
        client.invalidateQueries(["estate-favorites-list"]);
        client.invalidateQueries(["favorite", { userId, estateId: estate_id }]);
      },
    }
  );
};

interface Props {
  id: string;
}

export const FavoritesButton: React.FC<Props> = ({ id }) => {
  const { t } = useTranslation();
  const { mutate: addToFavorites, isLoading: isAddToFavoritesLoading } =
    useAddToFavorites();
  const {
    mutate: removeFromFavorites,
    isLoading: isRemoveFromFavoritesLoading,
  } = useRemoveFromFavorites();
  const { data: favorite, isLoading } = useFavorite(id);

  const handleClick = () => {
    if (favorite) {
      removeFromFavorites(id);
    } else {
      addToFavorites(id);
    }
  };

  const loading =
    isLoading || isAddToFavoritesLoading || isRemoveFromFavoritesLoading;

  if (favorite) {
    return (
      <Button
        leftIcon={<MinusIcon />}
        onClick={handleClick}
        isLoading={loading}
      >
        {t("fromFavorites")}
      </Button>
    );
  }

  return (
    <Button leftIcon={<StarIcon />} onClick={handleClick} isLoading={loading}>
      {t("toFavorites")}
    </Button>
  );
};
