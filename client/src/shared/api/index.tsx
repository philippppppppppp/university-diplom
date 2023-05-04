import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
} from "react";

export type Query = string;

export type Variables = object;

interface Context {
  request<T>(query: Query, variables?: Variables): Promise<T>;
}

const context = createContext({} as Context);

export interface Client {
  request<T>(query: Query, variables?: Variables): Promise<T>;
}

interface Props {
  client: Client;
}

export const ApiProvider: FC<PropsWithChildren<Props>> = ({
  client,
  children,
}) => {
  const request = useCallback(
    async <T,>(query: Query, variables?: Variables): Promise<T> => {
      return await client.request<T>(query, variables);
    },
    [client]
  );

  return <context.Provider value={{ request }}>{children}</context.Provider>;
};

export const useApi = () => useContext(context);

export interface ByPkResponse<T> {
  users_by_pk: T;
}
