import { useQuery } from "@tanstack/react-query";
import { ByPkResponse, useApi } from "../../shared/api";
import { gql } from "graphql-request";
import { useAuth } from "../../shared/auth";

const query = gql`
  query ($id: uuid!) {
    users_by_pk(id: $id) {
      id
      name
    }
  }
`;

interface User {
  id: string;
  name: string;
}

export const useUser = (id?: string | null) => {
  const { request } = useApi();
  const { authenticated } = useAuth();
  return useQuery(
    ["user"],
    async () => {
      const { users_by_pk } = await request<ByPkResponse<User>>(query, { id });
      return users_by_pk;
    },
    {
      enabled: authenticated,
      refetchOnWindowFocus: false,
    }
  );
};
