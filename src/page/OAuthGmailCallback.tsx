// src/page/OAuthCallback.tsx
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "../hooks/use-toast";

export default function OAuthGmailCallback() {
  const { toast } = useToast();
  const [, navigate] = useLocation(); // Navigate function from Wouter

  useEffect(() => {
    // Read query parameters from the full browser URL
    const queryString = window.location.search;
    const url = new URLSearchParams(queryString);
    const regEmail = url.get("regemail");
    const userId = url.get("userid");
    const success = url.get("success");

    if (success === "true" && regEmail && userId) {
      localStorage.setItem("regEmail", regEmail);
      sessionStorage.setItem("regEmail", regEmail);
      localStorage.setItem("regUserId", userId);
      sessionStorage.setItem("regUserId", userId);
      console.log("Stored regEmail in localStorage and sessionStorage");
      navigate("/email");
    } else {
      toast({
        title: "Gmail Authorization failed",
        description: "Gmail OAuth was not successful.",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [navigate]);

  return <p>Redirecting...</p>;
}
