import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../shared/api";
import { gql } from "graphql-request";
import { useAuth } from "../../shared/auth";

const query = gql`
  query ($id: uuid!) {
    users_by_pk(id: $id) {
      id
      name
      email
    }
  }
`;

interface Viewer {
  id: string;
  name: string;
}

export const useViewer = () => {
  const { request } = useApi();
  const { authenticated, userId } = useAuth();
  return useQuery(
    ["user", userId],
    async () => {
      const { users_by_pk } = await request<{ users_by_pk: Viewer }>(query, {
        id: userId,
      });
      return users_by_pk;
    },
    {
      enabled: authenticated,
      refetchOnWindowFocus: false,
    }
  );
};
