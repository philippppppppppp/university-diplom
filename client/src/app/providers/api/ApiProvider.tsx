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

//TODO: Fix it XD
export const ApiProvider: FC<PropsWithChildren> = ({ children }) => {
  const { authToken, refresh } = useAuth();
  const instanceRef = useRef(
    axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    })
  );
  const requestInterceptorRef = useRef<null | number>(null);
  const responseInterceptorRef = useRef<null | number>(null);
  const refreshRequest = useRef<null | ReturnType<typeof refresh>>(null);

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

  if (requestInterceptorRef.current !== null) {
    instanceRef.current.interceptors.request.eject(
      requestInterceptorRef.current
    );
  }

  requestInterceptorRef.current = instanceRef.current.interceptors.request.use(
    (config) => {
      //@ts-ignore
      if (!config.retry) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
      return config;
    }
  );

  if (responseInterceptorRef.current !== null) {
    instanceRef.current.interceptors.response.eject(
      responseInterceptorRef.current
    );
  }

  responseInterceptorRef.current =
    instanceRef.current.interceptors.response.use(
      async (res) => {
        const code = res.data.errors?.[0].extensions.code;
        if (res.data !== undefined) {
          return res.data;
        }
        //@ts-ignore
        if (code !== "invalid-jwt" || res.config.retry) {
          throw res;
        }
        if (!refreshRequest.current) {
          refreshRequest.current = refresh();
        }
        const token = await refreshRequest.current;
        //@ts-ignore
        return instanceRef.current({
          ...res.config,
          retry: true,
          headers: { ...res.headers, Authorization: `Bearer ${token}` },
        });
      },
      (err) => err
    );

  return (
    <QueryClientProvider client={queryClient}>
      <ApiProviderLib client={apiClient}>{children}</ApiProviderLib>
    </QueryClientProvider>
  );
};
