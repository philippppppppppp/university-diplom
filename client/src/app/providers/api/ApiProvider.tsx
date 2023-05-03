import { PropsWithChildren, FC, useRef, useMemo } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../../shared/auth";
import {
  ApiProvider as ApiProviderLib,
  Client,
  Query,
  Variables,
} from "../../../shared/api";

const queryClient = new QueryClient();

export const ApiProvider: FC<PropsWithChildren> = ({ children }) => {
  const { authToken } = useAuth();
  const instanceRef = useRef(
    axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    })
  );
  const interceptorRef = useRef<null | number>(null);

  const apiClient: Client = useMemo(() => {
    return {
      async request<T>(query: Query, variables: Variables) {
        const { data } = await instanceRef.current.post<T>("", {
          query,
          variables,
        });
        return data;
      },
    };
  }, []);

  if (interceptorRef.current !== null) {
    instanceRef.current.interceptors.request.eject(interceptorRef.current);
  }

  interceptorRef.current = instanceRef.current.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${authToken}`;
      return config;
    }
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ApiProviderLib client={apiClient}>{children}</ApiProviderLib>
    </QueryClientProvider>
  );
};
