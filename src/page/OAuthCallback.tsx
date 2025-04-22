// src/page/OAuthCallback.tsx
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "../hooks/use-toast";

export default function OAuthCallback() {
  const { toast } = useToast();
  const [, navigate] = useLocation(); // Navigate function from Wouter

  useEffect(() => {
    // Read query parameters from the full browser URL
    const queryString = window.location.search;
    const url = new URLSearchParams(queryString);
    const userId = url.get("userId");
    const success = url.get("success");

    console.log("OAuth Redirect Params ->", { userId, success });

    if (success === "true" && userId) {
      localStorage.setItem("userId", userId);
      sessionStorage.setItem("userId", userId);
      console.log("Stored userId in localStorage and sessionStorage");
      navigate("/dashboard");
    } else {
      toast({
        title: "Login failed",
        description: "Google OAuth login was not successful.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [navigate]);

  return <p>Redirecting...</p>;
}
