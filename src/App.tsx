import { lazy, Suspense, useEffect, useState } from "react";
import { ApolloProvider } from "@apollo/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./lib/theme-provider";
import { queryClient } from "./lib/queryClient";
import EmailClient from "./page/EmailClient";
import NotFound from "./page/not-found";
import Home from "./page/Home";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import OAuthCallback from "./page/OAuthCallback";
import OAuthGmailCallback from "./page/OAuthGmailCallback";

const AuthPage = lazy(() => import("./page/auth-page"));
const DashboardPage = lazy(() => import("./page/dashboard_new"));
const EmailDashboardPage = lazy(() => import("./page/EmailDashboard"));

const Auth = () => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }
  >
    <AuthPage />
  </Suspense>
);

const Dashboard = () => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }
  >
    <DashboardPage />
  </Suspense>
);

const EmailDashboard = () => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }
  >
    <EmailDashboardPage />
  </Suspense>
);

// Protected route component
const ProtectedRoute = ({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) => {
  const { user, isLoading } = useAuth();

  // If we're still loading, show a loading indicator
  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Route>
    );
  }

  // If no user is logged in, redirect to auth page
  if (!user) {
    return (
      <Route path={path}>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="mb-6 text-center">
            You need to be logged in to access this page
          </p>
          <a
            href="/auth"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-600 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </Route>
    );
  }

  // If user is logged in, render the component
  return (
    <Route path={path}>
      <Component />
    </Route>
  );
};

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/emailclient" component={EmailClient} />
      <Route path="/oauth/callback" component={OAuthCallback} />
      <Route path="/oauthgmail/callback" component={OAuthGmailCallback} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/email" component={EmailDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a short loading time to allow fonts and resources to load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
  
      <ThemeProvider defaultTheme="system" storageKey="email-client-theme">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <Router />
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
  
  );
}

export default App;
