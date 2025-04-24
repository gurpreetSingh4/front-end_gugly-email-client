import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ApolloProvider } from "@apollo/client";
import { createApolloClient } from "./apollo-client";

type ApolloClientContextType = {
  clientReady: boolean;
  reloadClient: () => void;
};

const ApolloClientContext = createContext<ApolloClientContextType | undefined>(undefined);

export const ApolloClientProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<any>(null);
  const [clientReady, setClientReady] = useState(false);

  const reloadClient = () => {
    const regEmail = localStorage.getItem("regEmail");
    const userId = localStorage.getItem("regUserId");
    if (regEmail && userId) {
      const newClient = createApolloClient(userId, regEmail);
      setClient(newClient);
      setClientReady(true);
    } else {
      setClient(null); // Clear client if user logs out or is missing
      setClientReady(false);
    }
  };

  useEffect(() => {
    reloadClient();
  }, []);

  return (
    <ApolloClientContext.Provider value={{ reloadClient, clientReady }}>
      {client ? (
        <ApolloProvider client={client}>{children}</ApolloProvider>
      ) : (
        children // App renders even when client is not ready
      )}
    </ApolloClientContext.Provider>
  );
};

export const useApolloClientManager = () => {
  const context = useContext(ApolloClientContext);
  if (!context) throw new Error("useApolloClientManager must be used within ApolloClientProvider");
  return context;
};
