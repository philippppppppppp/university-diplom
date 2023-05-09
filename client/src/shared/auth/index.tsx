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

export type AuthToken = string;

export type ActivationToken = string;

export interface Credentials {
  email: string;
  password: string;
}

export type RegisterData = Credentials & { name: string };

interface Auth {
  userId: null | string;
  authenticated: boolean;
  register(registerData: RegisterData): Promise<void>;
  activate(activationToken: ActivationToken): Promise<void>;
  login(credentials: Credentials): Promise<void>;
  refresh(): Promise<void>;
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

interface TokenService {
  token: AuthToken | null;
  get(): AuthToken | null;
  set(token: AuthToken | null): void;
  clear(): void;
}

export const tokenService: TokenService = {
  token: null,
  get() {
    return this.token;
  },
  set(token) {
    this.token = token;
  },
  clear() {
    this.token = null;
  },
};

export const AuthProvider: FC<PropsWithChildren<Props>> = ({
  children,
  client,
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const refreshRequestRef = useRef<null | ReturnType<Auth["refresh"]>>(null);
  const authenticated = !!userId;

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
        const token = await client.login(credentials);
        tokenService.set(token);
        setUserId(getIdFromJwt(token));
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
      tokenService.set(token);
      setUserId(getIdFromJwt(token));
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
      tokenService.clear();
      setUserId(null);
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

  if (loading) {
    return null;
  }

  return (
    <context.Provider
      value={{
        userId,
        authenticated,
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
