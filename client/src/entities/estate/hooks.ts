import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { useApi } from "../../shared/api";
import { toApiArray } from "../../shared/toApiArray";

export type EstateType = "house" | "flat";

export interface EstateItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  address: string;
  priceUAH: number;
  createdAt: string;
  rooms: number;
  livingAreaM2: number;
  kitchenAreaM2: number;
  type: EstateType;
}

export interface CreateEstate {
  title: string;
  description: string;
  images: string[];
  address: string;
  priceUAH: string;
  rooms: string;
  livingAreaM2: string;
  kitchenAreaM2: string;
  type: EstateType | "";
}

export type EstateRooms = 1 | 2 | 3 | 4;

const estateListQuery = gql`
  query ($filters: estate_bool_exp) {
    estate(where: $filters) {
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

export const useEstateList = ({
  type,
  rooms,
  priceFrom,
  priceTo,
}: {
  type?: string;
  rooms?: string;
  priceFrom?: string;
  priceTo?: string;
}) => {
  const { request } = useApi();
  return useQuery(
    ["estate-list", type, rooms, priceFrom, priceTo],
    async () => {
      const { estate } = await request<{ estate: EstateItem[] }>({
        query: estateListQuery,
        variables: {
          filters: {
            ...(!!type && { type: { _eq: type } }),
            ...(!!rooms && { rooms: { _eq: rooms } }),
            ...((!!priceFrom || !!priceTo) && {
              priceUAH: {
                ...(!!priceFrom && { _gte: priceFrom }),
                ...(!!priceTo && { _lte: priceTo }),
              },
            }),
          },
        },
      });
      return estate;
    }
  );
};

interface Author {
  id: string;
  name: string;
  phone: string;
  lastOnline?: string;
}

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
        estate_by_pk: EstateItem & { author: Author };
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
    async ({ images, ...values }: CreateEstate) => {
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
