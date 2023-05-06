import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { useApi } from "../../shared/api";

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
      areaM2
    }
  }
`;

export interface EstateItem {
  id: string;
  title: string;
  description?: string;
  images: string[];
  address?: string;
  priceUAH: number;
  createdAt: string;
  rooms: number;
  areaM2: number;
}

export type EstateType = "house" | "flat";

export type EstateRooms = 1 | 2 | 3 | 4;

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
      const { estate } = await request<{ estate: EstateItem[] }>(
        estateListQuery,
        {
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
        }
      );
      return estate;
    }
  );
};