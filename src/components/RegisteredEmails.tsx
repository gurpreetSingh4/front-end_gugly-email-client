import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { useToast } from "../hooks/use-toast";
import { Bot, MinusCircle } from "lucide-react"; // optional, use any icon set you're using
import { useLocation } from "wouter"; // Correct import



interface RegisteredEmail {
  email: string;
  name: string;
  profilePic?: string;
}
// const navigate = useNavigate();

export function RegisteredEmails({
  userId,
  onEmailSelect,
}: {
  userId: string;
  onEmailSelect?: () => void;
}) {
  const [emails, setEmails] = useState<RegisteredEmail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const sidebarOpen = true
  const { toast } = useToast();
const [, navigate] = useLocation();


  useEffect(() => {
    fetchRegisteredEmails();
  }, [userId]);

  const fetchRegisteredEmails = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_AUTH_SERVICE_URL
        }/api/auth/userregemails?userid=${userId}`
      );
      if (!response || !response.data)
        throw new Error("Failed to fetch emails");

      const normalizedEmails = (response.data.data || []).map((email: any) => ({
        ...email,
        profilePic:
          email.profilePic || email.picture || "/fallback-profile.png",
      }));

      setEmails(normalizedEmails);
    } catch (error) {
      console.error("Error fetching registered emails:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailClick = async (email: string, name: string) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_EMAIL_SERVICE_URL
        }/api/email/refreshaccesstoken?userid=${userId}&regemail=${email}&regname=${name}`
      );
      console.log("response bhi dekho", response)
      if (!response || !response.data) {
        toast({
          title: "Access Token Refresh failed",
          description: "Failed to fetch emails",
          variant: "destructive",
        });
        throw new Error("Failed to fetch emails");
      }
      localStorage.setItem("regEmail", email);
      sessionStorage.setItem("regEmail", email);
      localStorage.setItem("regUserId", userId);
      sessionStorage.setItem("regUserId", userId);
      if (response.data.success) {
        onEmailSelect?.();
        toast({
          title: "Access Token Refresh",
          description: `${response.data.message}`,
        });
      }
    } catch (error) {
      console.error("Error initiating OAuth Gmail:", error);
      toast({
        title: "Access Token Refresh failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleRemoveEmail = async (email: string) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_EMAIL_SERVICE_URL
        }/api/email/deleteregisteredemail?userid=${userId}&regemail=${email}`
      );
      if (response.data.success) {
        toast({
          title: "Email removed",
          description:
            response.data.message || "Email was successfully removed",
        });
        fetchRegisteredEmails(); // Refresh list
      } else {
        throw new Error(response.data.message || "Failed to remove email");
      }
    } catch (error) {
      console.error("Error removing email:", error);
      toast({
        title: "Failed to remove email",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-3">
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : emails.length === 0 ? (
        <p className="text-gray-500">No registered emails found</p>
      ) : (
        emails.map((email) => (
          <div key={email.email} className="relative group">
            {/* Hover Target Group Wrapper */}
            <div className="relative group w-full">
              <Button
                variant="ghost"
                className={`w-full flex items-center gap-2 overflow-hidden pr-10 ${
                  !sidebarOpen ? "justify-center px-0" : "justify-start px-2"
                }`}
                onClick={() => handleEmailClick(email.email, email.name)}
              >
                {email.profilePic ? (
                  <img
                    src={email.profilePic}
                    alt={email.name}
                    className="h-8 w-8 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-white shrink-0">
                    ?
                  </div>
                )}
                {sidebarOpen && (
                  <div className="flex flex-col min-w-0">
                    <p className="font-medium truncate">{email.name}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {email.email}
                    </p>
                  </div>
                )}
              </Button>
              <button
                className="absolute right-10 top-1/2 -translate-y-1/2 opacity-0 scale-75
                          group-hover:opacity-100 group-hover:scale-100
                          pointer-events-none group-hover:pointer-events-auto
                          transition-all duration-300 hover:bg-blue-100 active:bg-red-300 rounded-full p-1"
                style={{ transitionDelay: "1.0s" }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/emailclient');
                }}
                title="Open Email Client"
              >
                <Bot className="h-5 w-5 text-blue-500 hover:text-blue-700 active:text-red-600 transition-all duration-300" />
              </button>

              {/* Zoom-in Remove Button */}
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 scale-75 
                         group-hover:opacity-100 group-hover:scale-100 
                         pointer-events-none group-hover:pointer-events-auto 
                         transition-all duration-300"
                style={{ transitionDelay: "1.4s" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveEmail(email.email);
                }}
                title="Remove this registered email"
              >
                <MinusCircle className="h-5 w-5 text-red-500 hover:text-red-700 group-hover:brightness-125 transition-all duration-300" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
