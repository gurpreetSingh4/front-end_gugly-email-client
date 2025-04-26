import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import {  queryClient } from "../lib/queryClient";
import { useToast } from "./use-toast";
import axios from "axios";

// User type
export interface User {
  id: number;
  fullName: string | null;
  email: string | null;
  profilePic: string | null;
  createdAt?: Date | null;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  password: string;
  fullName: string | null;
  email: string | null;
}

interface LogoutOutput {
  id: string;
  email: string;
}

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<LogoutOutput, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegisterData>;
  googleSignIn: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);

  // Grab userId from sessionStorage after render
  useEffect(() => {
    const storedId = sessionStorage.getItem("userId");
    if (storedId) setUserId(storedId);
  }, []);

  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ["/api/user", userId],
    enabled: !!userId,
    queryFn: async () => {
      const response = await axios.get(
        `${
          import.meta.env.VITE_AUTH_SERVICE_URL
        }/api/auth/userinfo?userid=${userId}`
      );
      if (!response || !response.data) throw new Error("Login failed");
      const { name, email, profilePicture, _id } = response.data.data;
      return {
        id: _id,
        fullName: name,
        email,
        profilePic: profilePicture,
      };
    },
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: LoginData) => {
      const response = await axios.post(
        `${import.meta.env.VITE_AUTH_SERVICE_URL}/api/auth/login`,
        { email, password }
      );
      if (!response || !response.data) throw new Error("Login failed");
      return response.data;
    },
    onSuccess: (userData: User) => {
      localStorage.setItem("userId", userData.id.toString());
      sessionStorage.setItem("userId", userData.id.toString());
      setUserId(userData.id.toString());
      queryClient.setQueryData(["/api/user", userData.id], userData);
      toast({
        title: "Login successful",
        description: `Welcome back${
          userData.fullName ? ", " + userData.fullName : ""
        }!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ password, fullName, email }: RegisterData) => {
      const response = await axios.post(
        `${import.meta.env.VITE_AUTH_SERVICE_URL}/api/auth/register`,
        { email, password, name: fullName }
      );
      if (!response || !response.data) throw new Error("Registration failed");
      return response.data;
    },
    onSuccess: (userData: User) => {
      localStorage.setItem("userId", userData.id.toString());
      sessionStorage.setItem("userId", userData.id.toString());
      setUserId(userData.id.toString());
      queryClient.setQueryData(["/api/user", userData.id], userData);
      toast({
        title: "Registration successful",
        description: `Welcome to GuglyMail, ${
          userData.fullName || userData.email
        }!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const storedUserId = localStorage.getItem("userId");
      const res = await axios.post(
        `${import.meta.env.VITE_AUTH_SERVICE_URL}/api/auth/logout`,
        {
          userId: storedUserId,
        }
      );
      if (!res) throw new Error("Logout failed");
      return res.data;
    },
    onSuccess: (logoutData: LogoutOutput) => {
      localStorage.removeItem("userId");
      sessionStorage.removeItem("userId");
      localStorage.removeItem("regEmail");
      sessionStorage.removeItem("regEmail");
      localStorage.removeItem("regUserId");
      sessionStorage.removeItem("regUserId");

      setUserId(null);
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logged out",
        description: `${logoutData.email} has been successfully logged out.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const googleSignIn = () => {
    window.location.href = `${
      import.meta.env.VITE_AUTH_SERVICE_URL
    }/api/auth/google`;
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        googleSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
