import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

export type AuthToken = string | null;

export type ActivationToken = string | null;

export interface Credentials {
  email: string;
  password: string;
}

export type RegisterData = Credentials & { name: string };

interface Auth {
  authToken: AuthToken;
  setAuthToken(authToken: AuthToken): void;
  authenticated: boolean;
  loggedOut: boolean;
  ready: boolean;
  register(registerData: RegisterData): Promise<void>;
  activate(activationToken: ActivationToken): Promise<void>;
  login(credentials: Credentials): Promise<void>;
  refresh(): Promise<void>;
  logout(): Promise<void>;
  loading: boolean;
}

const context = createContext<Auth>({
  authToken: null,
  setAuthToken: () => {},
  authenticated: false,
  loggedOut: false,
  ready: false,
  register: async () => {},
  activate: async () => {},
  login: async () => {},
  refresh: async () => {},
  logout: async () => {},
  loading: false,
});

export interface Client {
  register(registerData: RegisterData): Promise<void>;
  activate(activationToken: ActivationToken): Promise<void>;
  login(credentials: Credentials): Promise<AuthToken>;
  refresh(): Promise<AuthToken>;
  logout(): Promise<void>;
}

interface Props {
  client?: Client | null;
}

export const AuthProvider: FC<PropsWithChildren<Props>> = ({
  children,
  client,
}) => {
  const [authToken, setAuthToken] = useState<AuthToken>(null);
  const [loggedOut, setLoggedOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshed, setRefreshed] = useState(false);
  const authenticated = !!authToken;
  const ready = !!client;

  const register = useCallback(
    async (registerData: RegisterData) => {
      try {
        setLoading(true);
        await client!.register(registerData);
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
        await client!.activate(activationToken);
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
        setAuthToken(await client!.login(credentials));
      } catch (err) {
        throw err;
      } finally {
        setLoggedOut(false);
        setLoading(false);
      }
    },
    [client]
  );

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setAuthToken(await client!.refresh());
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [client]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await client!.logout();
      setAuthToken(null);
    } catch (err) {
    } finally {
      setLoggedOut(true);
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    if (!ready || authenticated || loggedOut || refreshed) return;
    refresh();
    setRefreshed(true);
  }, [ready, authenticated, loggedOut, refresh, refreshed]);

  return (
    <context.Provider
      value={{
        authToken,
        setAuthToken,
        authenticated,
        loggedOut,
        ready,
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

export const useOnAuthReady = (cb: () => void) => {
  const { ready } = useAuth();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done && ready) {
      cb();
      setDone(true);
    }
  }, [ready, done, cb]);
};
