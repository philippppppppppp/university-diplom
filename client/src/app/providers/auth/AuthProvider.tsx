import { FC, PropsWithChildren, useRef, useMemo } from "react";
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

const messagesToShow = [
  "INVALID_CREDENTIALS",
  "NOT_ACTIVATED",
  "EMAIL_ALREADY_REGISTERED",
  "PHONE_ALREADY_REGISTERED",
  "INVALID_ACTIVATION_TOKEN",
  "ACTIVATION_TOKEN_EXPIRED",
  "USER_ALREADY_ACTIVATED",
  "INVALID_TOKEN",
];

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const toast = useToast();
  const instanceRef = useRef(
    axios.create({
      baseURL: process.env.REACT_APP_AUTH_URL,
      withCredentials: true,
    })
  );
  const interceptorRef = useRef<null | number>(null);

  const client: Client = useMemo(() => {
    return {
      async register(registerData) {
        await instanceRef.current.post<ResponseData>("/register", registerData);
      },
      async activate(activationToken) {
        await instanceRef.current.post<ResponseData>("/activate", {
          activationToken,
        });
      },
      async login(credentials) {
        const { data } = await instanceRef.current.post<
          ResponseData<TokenResponse>
        >("/login", credentials);
        return data.token;
      },
      async refresh() {
        const { data } = await instanceRef.current.post<
          ResponseData<TokenResponse>
        >("/refresh");
        return data.token;
      },
      async logout() {
        await instanceRef.current.post<ResponseData>("/logout");
      },
    };
  }, []);

  if (interceptorRef.current !== null) {
    instanceRef.current.interceptors.response.eject(interceptorRef.current);
  }

  interceptorRef.current = instanceRef.current.interceptors.response.use(
    (res) => res,
    ({ response }: AxiosError<ErrorSchema>) => {
      const error = response!.data;
      if (!messagesToShow.includes(error.message)) {
        toast({
          title: error.message,
          description: error.details,
          status: "error",
        });
      }
      throw error;
    }
  );

  return <AuthProviderLib client={client}>{children}</AuthProviderLib>;
};
