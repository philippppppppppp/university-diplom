import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../../shared/api";
import { gql } from "graphql-request";
import { useAuth } from "../../shared/auth";

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

export const useFavorite = (estateId: string) => {
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

export const useAddToFavorites = () => {
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

export const useRemoveFromFavorites = () => {
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
