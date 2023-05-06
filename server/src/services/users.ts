import { GraphQLClient, gql } from "graphql-request";

const hasuraUrl = process.env.HASURA_URL ?? "http://localhost:8080/v1/graphql";
const hasuraAdminSecret = process.env.HASURA_ADMIN_SECRET ?? "";

const client = new GraphQLClient(hasuraUrl, {
  headers: { "x-hasura-admin-secret": hasuraAdminSecret },
});

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  activated: boolean;
  lastOnline: string | null;
}

const getUserByIdQuery = gql`
  query getUserById($id: uuid!) {
    users_by_pk(id: $id) {
      id
      email
      password
      name
      phone
      activated
      lastOnline
    }
  }
`;

export const getUserById = async (id: string) => {
  const { users_by_pk } = await client.request<{ users_by_pk: User }>(
    getUserByIdQuery,
    {
      id,
    }
  );
  return users_by_pk;
};

const activateUserQuery = gql`
  mutation activateUser($id: uuid!) {
    update_users_by_pk(pk_columns: { id: $id }, _set: { activated: true }) {
      id
      email
      password
      name
      phone
      activated
      lastOnline
    }
  }
`;

export const activateUser = async (id: string) => {
  const { users_by_pk } = await client.request<{ users_by_pk: User }>(
    activateUserQuery,
    {
      id,
    }
  );
  return users_by_pk;
};

const getUserByEmailQuery = gql`
  query getUserByEmail($email: String) {
    users(where: { email: { _eq: $email } }) {
      id
      email
      password
      name
      phone
      activated
      lastOnline
    }
  }
`;

export const getUserByEmail = async (email: string) => {
  const { users } = await client.request<{ users: User[] }>(
    getUserByEmailQuery,
    {
      email,
    }
  );
  return users[0];
};

const insertUserQuery = gql`
  mutation insertUser($email: String, $name: String, $password: String) {
    insert_users_one(
      object: { email: $email, name: $name, password: $password }
    ) {
      id
      email
      password
      name
      phone
      activated
      lastOnline
    }
  }
`;

export const insertUser = async (
  email: string,
  password: string,
  name: string
) => {
  const { insert_users_one } = await client.request<{ insert_users_one: User }>(
    insertUserQuery,
    {
      email,
      password,
      name,
    }
  );
  return insert_users_one;
};

const updateLastOnlineQuery = gql`
  mutation ($id: uuid!, $time: timestamptz) {
    update_users_by_pk(pk_columns: { id: $id }, _set: { lastOnline: $time }) {
      id
      email
      password
      name
      phone
      activated
      lastOnline
    }
  }
`;

export const updateLastOnline = async (id: string) => {
  const { update_users_by_pk } = await client.request<{
    update_users_by_pk: User;
  }>(updateLastOnlineQuery, {
    id,
    time: new Date().toISOString(),
  });
  return update_users_by_pk;
};
