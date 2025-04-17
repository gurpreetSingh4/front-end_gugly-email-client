import { Routes, Route, BrowserRouter } from "react-router-dom";

import { QueryClientProvider } from "@tanstack/react-query";
import EmailClient from "./page/EmailClient";
import NotFound from "./page/not-found";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./lib/theme-provider";
import { queryClient } from "./lib/queryClient";
import { ApolloProvider } from "@apollo/client";
import { client } from "./lib/apollo-client";

function App() {
  return (
    <ApolloProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="email-client-theme">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<EmailClient />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </ApolloProvider>
  );
}

export default App;
