import { GraphQLClient, gql } from "graphql-request";

const hasuraUrl = process.env.HASURA_URL ?? "http://localhost:8080/v1/graphql";
const hasuraAdminSecret = process.env.HASURA_ADMIN_SECRET ?? "";

const client = new GraphQLClient(hasuraUrl, {
  headers: { "x-hasura-admin-secret": hasuraAdminSecret },
});

const query = gql`
  query MyQuery($email: String) {
    users(where: { email: { _eq: $email } }) {
      email
      id
      name
      password
    }
  }
`;

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

export const getUserByEmail = async (email: string) => {
  const { users } = await client.request<{ users: User[] }>(query, { email });
  return users[0];
};
