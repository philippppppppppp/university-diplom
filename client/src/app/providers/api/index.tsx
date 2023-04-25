import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { PropsWithChildren, FC } from "react";

const client = new QueryClient();

export const ApiProvider: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
);
