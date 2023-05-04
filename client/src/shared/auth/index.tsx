import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { getIdFromJwt } from "../getIdFromJwt";

export type AuthToken = string | null;

export type ActivationToken = string | null;

export interface Credentials {
  email: string;
  password: string;
}

export type RegisterData = Credentials & { name: string };

interface Auth {
  authToken: AuthToken;
  authenticated: boolean;
  userId?: null | string;
  register(registerData: RegisterData): Promise<void>;
  activate(activationToken: ActivationToken): Promise<void>;
  login(credentials: Credentials): Promise<void>;
  refresh(): Promise<AuthToken>;
  logout(): Promise<void>;
  loading: boolean;
}

const context = createContext({} as Auth);

export interface Client {
  register(registerData: RegisterData): Promise<void>;
  activate(activationToken: ActivationToken): Promise<void>;
  login(credentials: Credentials): Promise<AuthToken>;
  refresh(): Promise<AuthToken>;
  logout(): Promise<void>;
}

interface Props {
  client: Client;
}

export const AuthProvider: FC<PropsWithChildren<Props>> = ({
  children,
  client,
}) => {
  const [authToken, setAuthToken] = useState<AuthToken>(null);
  const [loading, setLoading] = useState(false);
  const refreshRequestRef = useRef<null | ReturnType<Auth["refresh"]>>(null);
  const authenticated = !!authToken;
  const userId = authenticated ? getIdFromJwt(authToken) : null;

  const register = useCallback(
    async (registerData: RegisterData) => {
      try {
        setLoading(true);
        await client.register(registerData);
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  const activate = useCallback(
    async (activationToken: ActivationToken) => {
      try {
        setLoading(true);
        await client.activate(activationToken);
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  const login = useCallback(
    async (credentials: Credentials) => {
      try {
        setLoading(true);
        setAuthToken(await client.login(credentials));
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const token = await client.refresh();
      setAuthToken(token);
      return token;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, [client]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await client.logout();
      setAuthToken(null);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [client]);

  const refreshOnMount = useCallback(async () => {
    if (!refreshRequestRef.current) {
      refreshRequestRef.current = refresh();
    }
    await refreshRequestRef.current;
  }, [refresh]);

  useEffect(() => {
    refreshOnMount();
  }, [refreshOnMount]);

  return (
    <context.Provider
      value={{
        authToken,
        authenticated,
        userId,
        register,
        activate,
        login,
        refresh,
        logout,
        loading,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useAuth = () => useContext(context);
