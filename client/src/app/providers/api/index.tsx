import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { PropsWithChildren, FC } from "react";

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI,
  cache: new InMemoryCache(),
});

export const ApiProvider: FC<PropsWithChildren> = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);
