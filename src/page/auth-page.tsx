import { useState, useEffect } from "react";
import { z } from "zod";
import { Mail } from "lucide-react";
import { Redirect, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { ThemeToggle } from "../components/ui/theme-toggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAuth } from "../hooks/use-auth";


const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { 
    message: "Password must be at least 8 characters" 
  }).regex(
    /^(?=.*[A-Z])(?=.*\d).*$/,
    { message: "Password must include at least 1 uppercase letter and 1 number" }
  ),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, isLoading, loginMutation, registerMutation, googleSignIn } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left Side - Form */}
      <div className="flex flex-col w-full md:w-1/2 p-4 md:p-8 lg:p-12">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <Mail className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">GuglyMail</span>
          </div>
          <ThemeToggle />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="pt-6 animate-fade-in">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
                  <p className="text-gray-500 dark:text-gray-400">Sign in to your account to continue</p>
                </div>
                
                {/* Google OAuth Button */}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={googleSignIn}
                  className="w-full flex items-center justify-center font-medium mb-6"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </Button>
                
                <div className="relative flex items-center my-6">
                  <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                  <span className="flex-shrink mx-4 text-gray-400">or</span>
                  <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input 
                      id="login-email" 
                      placeholder="your_email"
                      {...loginForm.register("email")}
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-red-500 dark:text-red-400">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <a href="#" className="text-sm text-primary hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        Forgot password?
                      </a>
                    </div>
                    <Input 
                      id="login-password" 
                      type="password" 
                      placeholder="••••••••"
                      {...loginForm.register("password")}
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-500 dark:text-red-400">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="login-remember-me" 
                      {...loginForm.register("rememberMe")}
                    />
                    <Label htmlFor="login-remember-me" className="text-sm text-gray-600 dark:text-gray-400">
                      Keep me signed in
                    </Label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="pt-6 animate-fade-in">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold mb-2">Create an account</h1>
                  <p className="text-gray-500 dark:text-gray-400">Get started with GuglyMail today</p>
                </div>
                
                {/* Google OAuth Button */}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={googleSignIn}
                  className="w-full flex items-center justify-center font-medium mb-6"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign up with Google
                </Button>
                
                <div className="relative flex items-center my-6">
                  <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                  <span className="flex-shrink mx-4 text-gray-400">or</span>
                  <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full name</Label>
                    <Input 
                      id="register-name" 
                      placeholder="Your name"
                      {...registerForm.register("fullName")}
                    />
                    {registerForm.formState.errors.fullName && (
                      <p className="text-sm text-red-500 dark:text-red-400">{registerForm.formState.errors.fullName.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email address</Label>
                    <Input 
                      id="register-email" 
                      placeholder="you@example.com"
                      {...registerForm.register("email")}
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-red-500 dark:text-red-400">{registerForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input 
                      id="register-password" 
                      type="password" 
                      placeholder="••••••••"
                      {...registerForm.register("password")}
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-500 dark:text-red-400">{registerForm.formState.errors.password.message}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Must be at least 8 characters with 1 uppercase letter and 1 number
                    </p>
                  </div>
                  
                  {/* <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="register-terms" 
                      {...registerForm.register("agreeToTerms")}
                    />
                    <Label htmlFor="register-terms" className="text-sm text-gray-600 dark:text-gray-400 leading-tight">
                      I agree to the <a href="#" className="text-primary hover:text-primary-600 dark:hover:text-primary-400">Terms of Service</a> and <a href="#" className="text-primary hover:text-primary-600 dark:hover:text-primary-400">Privacy Policy</a>
                    </Label>
                  </div> */}
                  {/* {registerForm.formState.errors.agreeToTerms && (
                    <p className="text-sm text-red-500 dark:text-red-400">{registerForm.formState.errors.agreeToTerms.message}</p>
                  )} */}
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Creating account..." : "Create account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Right Side - Hero Section */}
      <div className="hidden md:flex md:w-1/2 bg-primary flex-col justify-center items-center p-12 text-white">
        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">The Intelligent Email Experience</h1>
            <p className="text-lg opacity-90">
              Revolutionize your communication with AI-powered email drafting, smart responses, and intelligent organization.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">AI-Powered Text Generation</h3>
                <p className="opacity-80">Generate perfect emails with intelligent AI suggestions based on simple prompts.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Smart Scheduling & Organization</h3>
                <p className="opacity-80">Send emails at the optimal time with AI-powered timing recommendations.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Enterprise Security</h3>
                <p className="opacity-80">Rest easy with advanced encryption, compliance features, and data protection.</p>
              </div>
            </div>
          </div>
          
          <div className="pt-6">
            <p className="text-sm opacity-80">
              "The AI text generation has completely transformed how our team handles email communications. We're saving hours each week!"
            </p>
            <div className="mt-2 flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/20 mr-2"></div>
              <div>
                <p className="text-sm font-medium">Sarah Johnson</p>
                <p className="text-xs opacity-80">Marketing Director</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}