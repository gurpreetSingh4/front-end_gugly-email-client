import { ApolloClient, InMemoryCache } from "@apollo/client";

export const createApolloClient = (userId: string, regEmail: string) => {
  return new ApolloClient({
    uri: `${import.meta.env.VITE_EMAIL_SERVICE_URL}/api/email/graphql?userid=${userId}&regEmail=${regEmail}`,
    cache: new InMemoryCache(),
    credentials: "include",
  });
};
