import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { useApi } from "../../shared/api";
import { toApiArray } from "../../shared/toApiArray";

export type EstateType = "house" | "flat";

export interface EstateItemInfo {
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

export type EstateListItem = EstateItemInfo;

export interface EstateItem extends EstateItemInfo {
  author: {
    id: string;
    name: string;
    phone: string;
    lastOnline?: string;
  };
}

export interface EstateFormValues {
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
  authorId,
}: {
  type?: string;
  rooms?: string;
  priceFrom?: string;
  priceTo?: string;
  authorId?: string | null;
}) => {
  const { request } = useApi();
  return useQuery(
    ["estate-list", type, rooms, priceFrom, priceTo, authorId],
    async () => {
      const { estate } = await request<{ estate: EstateListItem[] }>({
        query: estateListQuery,
        variables: {
          filters: {
            //TODO: FIX THIS
            ...(!!type && { type: { _eq: type } }),
            ...(!!rooms && { rooms: { _eq: rooms } }),
            ...((!!priceFrom || !!priceTo) && {
              priceUAH: {
                ...(!!priceFrom && { _gte: priceFrom }),
                ...(!!priceTo && { _lte: priceTo }),
              },
            }),
            ...(!!authorId && { author_id: { _eq: authorId } }),
          },
        },
      });
      return estate;
    }
  );
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
