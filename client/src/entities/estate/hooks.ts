import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { gql } from "graphql-request";
import { useApi } from "../../shared/api";
import { toApiArray } from "../../shared/toApiArray";
import { useAuth } from "../../shared/auth";
import type {
  EstateFormValues,
  EstateItem,
  EstateItemInfo,
  EstateListItem,
  ListFilters,
} from "./types";

export const transformEstateItemInfoToFormValues = ({
  priceUAH,
  rooms,
  livingAreaM2,
  kitchenAreaM2,
  title,
  address,
  description,
  type,
  images,
}: EstateItemInfo): EstateFormValues => ({
  title,
  address,
  description,
  type,
  images,
  priceUAH: priceUAH.toString(),
  rooms: rooms.toString(),
  livingAreaM2: livingAreaM2.toString(),
  kitchenAreaM2: kitchenAreaM2.toString(),
});

const limit = 10;

const transformFiltersToQueryVariable = ({
  priceFrom,
  priceTo,
  rooms,
  type,
}: ListFilters) => ({
  ...(!!type && { type: { _eq: type } }),
  ...(!!rooms && { rooms: { _eq: rooms } }),
  ...((!!priceFrom || !!priceTo) && {
    priceUAH: {
      ...(!!priceFrom && { _gte: priceFrom }),
      ...(!!priceTo && { _lte: priceTo }),
    },
  }),
});

const getNextPageParam = <T extends { length: number }>(lastPage: {
  data: T;
  nextOffset: number;
}) => {
  if (!lastPage.data.length) {
    return;
  }
  return lastPage.nextOffset;
};

const estateListQuery = gql`
  query ($limit: Int, $offset: Int, $filters: estate_bool_exp) {
    estate(limit: $limit, offset: $offset, where: $filters) {
      id
      title
      images
      address
      priceUAH
      createdAt
      description
      rooms
      livingAreaM2
      kitchenAreaM2
    }
  }
`;

export const useEstateList = (filters: ListFilters) => {
  const { request } = useApi();
  return useInfiniteQuery({
    queryKey: ["estate-list", filters],
    async queryFn({ pageParam: nextOffset }) {
      const offset = nextOffset ?? 0;
      const { estate } = await request<{ estate: EstateListItem[] }>({
        query: estateListQuery,
        variables: {
          limit,
          offset,
          filters: transformFiltersToQueryVariable(filters),
        },
      });
      return { data: estate, nextOffset: offset + limit };
    },
    getNextPageParam,
  });
};

export const useEstateFavoritesList = (filters: ListFilters) => {
  const { request } = useApi();
  const { userId } = useAuth();
  return useInfiniteQuery({
    queryKey: ["estate-favorites-list", filters],
    async queryFn({ pageParam: nextOffset }) {
      const offset = nextOffset ?? 0;
      const { estate } = await request<{ estate: EstateListItem[] }>({
        query: estateListQuery,
        variables: {
          limit,
          offset,
          filters: {
            ...transformFiltersToQueryVariable(filters),
            favorites: {
              user_id: { _eq: userId },
            },
          },
        },
        role: "user",
      });
      return { data: estate, nextOffset: offset + limit };
    },
    getNextPageParam,
  });
};

export const useEstateCreatedByUserList = (filters: ListFilters) => {
  const { request } = useApi();
  const { userId } = useAuth();
  return useInfiniteQuery({
    queryKey: ["estate-created-by-user-list", filters],
    async queryFn({ pageParam: nextOffset }) {
      const offset = nextOffset ?? 0;
      const { estate } = await request<{ estate: EstateListItem[] }>({
        query: estateListQuery,
        variables: {
          limit,
          offset,
          filters: {
            ...transformFiltersToQueryVariable(filters),
            author_id: { _eq: userId },
          },
        },
        role: "user",
      });
      return { data: estate, nextOffset: offset + limit };
    },
    getNextPageParam,
  });
};

const estateQuery = gql`
  query ($id: uuid!) {
    estate_by_pk(id: $id) {
      address
      livingAreaM2
      kitchenAreaM2
      createdAt
      description
      id
      images
      priceUAH
      rooms
      title
      type
      author {
        id
        name
        phone
        lastOnline
      }
    }
  }
`;

export const useEstate = (id?: string) => {
  const { request } = useApi();
  return useQuery(
    ["estate-item", id],
    async () => {
      const { estate_by_pk } = await request<{
        estate_by_pk: EstateItem;
      }>({
        query: estateQuery,
        variables: {
          id,
        },
      });
      return estate_by_pk;
    },
    {
      enabled: !!id,
    }
  );
};

const createEstateQuery = gql`
  mutation (
    $address: String
    $description: String
    $type: String
    $title: String
    $rooms: numeric
    $priceUAH: numeric
    $livingAreaM2: numeric
    $kitchenAreaM2: numeric
    $images: _text
  ) {
    insert_estate_one(
      object: {
        address: $address
        description: $description
        type: $type
        title: $title
        rooms: $rooms
        priceUAH: $priceUAH
        livingAreaM2: $livingAreaM2
        kitchenAreaM2: $kitchenAreaM2
        images: $images
      }
    ) {
      id
    }
  }
`;

export const useCreateEstate = () => {
  const { request } = useApi();
  const client = useQueryClient();
  return useMutation(
    async ({ images, ...values }: EstateFormValues) => {
      const { insert_estate_one } = await request<{
        insert_estate_one: { id: string };
      }>({
        query: createEstateQuery,
        variables: {
          ...values,
          images: toApiArray(images),
        },
        role: "user",
      });
      return insert_estate_one;
    },
    {
      onSuccess() {
        client.invalidateQueries(["estate-list"]);
      },
    }
  );
};

const updateEstateQuery = gql`
  mutation (
    $id: uuid!
    $address: String
    $description: String
    $type: String
    $title: String
    $rooms: numeric
    $priceUAH: numeric
    $livingAreaM2: numeric
    $kitchenAreaM2: numeric
    $images: _text
  ) {
    update_estate_by_pk(
      pk_columns: { id: $id }
      _set: {
        address: $address
        description: $description
        type: $type
        title: $title
        rooms: $rooms
        priceUAH: $priceUAH
        livingAreaM2: $livingAreaM2
        kitchenAreaM2: $kitchenAreaM2
        images: $images
      }
    ) {
      id
    }
  }
`;

export const useUpdateEstate = () => {
  const { request } = useApi();
  const client = useQueryClient();
  return useMutation(
    async ({ images, ...values }: EstateFormValues & { id: string }) => {
      const { update_estate_by_pk } = await request<{
        update_estate_by_pk: { id: string };
      }>({
        query: updateEstateQuery,
        variables: {
          ...values,
          images: toApiArray(images),
        },
        role: "user",
      });
      return update_estate_by_pk;
    },
    {
      onSuccess({ id }) {
        client.invalidateQueries(["estate-list"]);
        client.invalidateQueries(["estate-item", id]);
      },
    }
  );
};
