import { useState } from "react";
import { useLocation } from "wouter";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Hero from "../components/sections/Hero";
import Features from "../components/sections/Features";
import TechStack from "../components/sections/TechStack";
import Testimonials from "../components/sections/Testimonials";
import CTA from "../components/sections/CTA";
import { useAuth } from "../hooks/use-auth";

const Home = () => {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  // const user = false;

  const goToAuth = (tab: "login" | "register" = "login") => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
      // The tab handling would be in auth-page.tsx
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header
        onLogin={() => goToAuth("login")}
        onRegister={() => goToAuth("register")}
      />

      <main className="flex-grow">
        <Hero onGetStarted={() => goToAuth("register")} />
        <Features />
        <TechStack />
        <Testimonials />
        <CTA onGetStarted={() => goToAuth("register")} />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
