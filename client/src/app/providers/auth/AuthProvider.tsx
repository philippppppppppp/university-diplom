import { FC, PropsWithChildren, useEffect, useState } from "react";
import {
  AuthProvider as AuthProviderLib,
  AuthToken,
  Client,
} from "../../../shared/auth";
import axios, { AxiosError } from "axios";
import { useToast } from "@chakra-ui/react";

interface ResponseSchema {
  status: "OK";
}

interface ErrorSchema {
  status: "Error";
  message: string;
  details?: string;
}

type ResponseData<T = {}> = ResponseSchema & T;

interface TokenResponse {
  token: AuthToken;
}

const messagesToForward = [
  "INVALID_CREDENTIALS",
  "NOT_ACTIVATED",
  "EMAIL_ALREADY_REGISTERED",
  "INVALID_ACTIVATION_TOKEN",
  "ACTIVATION_TOKEN_EXPIRED",
  "USER_ALREADY_ACTIVATED",
];
const messagesNotToHandle = ["INVALID_TOKEN"];

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const toast = useToast();
  const [client, setClient] = useState<null | Client>(null);

  useEffect(() => {
    const instance = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      withCredentials: true,
    });

    const interceptor = instance.interceptors.response.use(
      (res) => res,
      ({ response }: AxiosError<ErrorSchema>) => {
        const error = response!.data;

        if (messagesToForward.includes(error.message)) throw error;
        if (messagesNotToHandle.includes(error.message)) return;
        toast({
          title: error.message,
          description: error.details,
          status: "error",
        });
      }
    );

    const client: Client = {
      async register(registerData) {
        await instance.post<ResponseData>("/register", registerData);
      },
      async activate(activationToken) {
        await instance.post<ResponseData>("/activate", { activationToken });
      },
      async login(credentials) {
        const { data } = await instance.post<ResponseData<TokenResponse>>(
          "/login",
          credentials
        );
        return data.token;
      },
      async refresh() {
        const { data } = await instance.post<ResponseData<TokenResponse>>(
          "/refresh"
        );
        return data.token;
      },
      async logout() {
        await instance.post<ResponseData>("/logout");
      },
    };

    setClient(client);

    return () => {
      instance.interceptors.response.eject(interceptor);
      setClient(null);
    };
  }, [toast]);

  if (!client) return null;

  return <AuthProviderLib client={client}>{children}</AuthProviderLib>;
};
