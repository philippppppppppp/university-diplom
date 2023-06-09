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
import { NavigateWithRedirect } from "../redirect";

export type AuthToken = string;

export type ActivationToken = string;

export interface Credentials {
  email: string;
  password: string;
}

export type RegisterData = Credentials & { name: string; phone: string };

interface Auth {
  userId: null | string;
  authenticated: boolean;
  register(registerData: RegisterData): Promise<void>;
  activate(activationToken: ActivationToken): Promise<void>;
  login(credentials: Credentials): Promise<void>;
  refresh(): Promise<void>;
  logout(): Promise<void>;
  loadingInitialRefresh: boolean;
  notAuthenticatedAfterInitialRefresh: boolean;
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
  const [loadingInitialRefresh, setInitialRefreshLoading] = useState(true);
  const refreshRequestRef = useRef<null | ReturnType<Auth["refresh"]>>(null);
  const authenticated = !!userId;
  const notAuthenticatedAfterInitialRefresh =
    !authenticated && !loadingInitialRefresh;

  const register = useCallback(
    async (registerData: RegisterData) => {
      try {
        await client.register(registerData);
      } catch (err) {
        throw err;
      }
    },
    [client]
  );

  const activate = useCallback(
    async (activationToken: ActivationToken) => {
      try {
        await client.activate(activationToken);
      } catch (err) {
        throw err;
      }
    },
    [client]
  );

  const login = useCallback(
    async (credentials: Credentials) => {
      try {
        const token = await client.login(credentials);
        tokenService.set(token);
        setUserId(getIdFromJwt(token));
      } catch (err) {
        throw err;
      }
    },
    [client]
  );

  const refresh = useCallback(async () => {
    try {
      const token = await client.refresh();
      tokenService.set(token);
      setUserId(getIdFromJwt(token));
    } catch (err) {
      throw err;
    }
  }, [client]);

  const logout = useCallback(async () => {
    try {
      await client.logout();
      tokenService.clear();
      setUserId(null);
    } catch (err) {}
  }, [client]);

  useEffect(() => {
    const initiallyRefresh = async () => {
      try {
        if (!refreshRequestRef.current) {
          refreshRequestRef.current = refresh();
        }
        await refreshRequestRef.current;
        setInitialRefreshLoading(false);
      } catch {}
    };
    initiallyRefresh();
  }, [refresh]);

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
        loadingInitialRefresh,
        notAuthenticatedAfterInitialRefresh,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useAuth = () => useContext(context);

export const PrivateRoute: FC<PropsWithChildren> = ({ children }) => {
  const { loadingInitialRefresh, authenticated } = useAuth();
  if (loadingInitialRefresh) {
    return null;
  }

  if (authenticated) {
    return <>{children}</>;
  }

  return <NavigateWithRedirect to="/login" />;
};
