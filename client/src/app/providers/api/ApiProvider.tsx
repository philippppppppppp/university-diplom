import { PropsWithChildren, FC, useRef, useMemo } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import axios, { AxiosRequestConfig } from "axios";
import { tokenService, useAuth } from "../../../shared/auth";
import {
  ApiProvider as ApiProviderLib,
  Client,
  Query,
  Variables,
  Role,
} from "../../../shared/api";

const queryClient = new QueryClient({});

const refreshRetry = new Set<AxiosRequestConfig>();

export const ApiProvider: FC<PropsWithChildren> = ({ children }) => {
  const { refresh } = useAuth();
  const instanceRef = useRef(
    axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    })
  );
  const requestInterceptorRef = useRef<null | number>(null);
  const responseInterceptorRef = useRef<null | number>(null);
  const refreshRequest = useRef<null | Promise<void>>(null);

  const apiClient: Client = useMemo(() => {
    return {
      async request<T>({
        query,
        variables,
        role = "anonymous",
      }: {
        query: Query;
        variables?: Variables;
        role?: Role;
      }) {
        const { data } = await instanceRef.current.post<T>(
          "",
          {
            query,
            variables,
          },
          {
            headers: {
              "x-hasura-role": role,
            },
          }
        );
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
      const token = tokenService.get();
      if (!!token) {
        config.headers.Authorization = `Bearer ${token}`;
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
        if (res.data.data !== undefined) {
          return res.data;
        }
        if (code !== "invalid-jwt" || refreshRetry.has(res.config)) {
          refreshRetry.delete(res.config);
          throw res;
        }
        if (!refreshRequest.current) {
          refreshRequest.current = refresh();
        }
        await refreshRequest.current;
        refreshRequest.current = null;
        refreshRetry.add(res.config);
        return instanceRef.current(res.config);
      },
      (err) => err
    );

  return (
    <QueryClientProvider client={queryClient}>
      <ApiProviderLib client={apiClient}>
        <ReactQueryDevtools /> {children}
      </ApiProviderLib>
    </QueryClientProvider>
  );
};
