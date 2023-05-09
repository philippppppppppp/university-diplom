import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
} from "react";

export type Query = string;

export type Variables = object;

export type Role = "anonymous" | "user";

interface Context {
  request<T>({
    query,
    variables,
    role = "anonymous",
  }: {
    query: Query;
    variables?: Variables;
    role?: Role;
  }): Promise<T>;
}

const context = createContext({} as Context);

export interface Client {
  request<T>({
    query,
    variables,
    role = "anonymous",
  }: {
    query: Query;
    variables?: Variables;
    role?: Role;
  }): Promise<T>;
}

interface Props {
  client: Client;
}

export const ApiProvider: FC<PropsWithChildren<Props>> = ({
  client,
  children,
}) => {
  const request = useCallback(
    async <T,>({
      query,
      variables,
      role,
    }: {
      query: Query;
      variables?: Variables;
      role?: Role;
    }): Promise<T> => {
      return await client.request<T>({ query, variables, role });
    },
    [client]
  );

  return <context.Provider value={{ request }}>{children}</context.Provider>;
};

export const useApi = () => useContext(context);
