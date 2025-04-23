import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { useToast } from "../hooks/use-toast";
import { MinusCircle } from "lucide-react"; // optional, use any icon set you're using

interface RegisteredEmail {
  email: string;
  name: string;
  profilePic?: string;
}

export function RegisteredEmails({ userId }: { userId: string }) {
  const [emails, setEmails] = useState<RegisteredEmail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useToast();

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

      setEmails(response.data.data || []);
    } catch (error) {
      console.error("Error fetching registered emails:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailClick = async (email: string) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_EMAIL_SERVICE_URL
        }/api/email/refreshaccesstoken?userid=${userId}&regemail=${email}`
      );
      if (!response || !response.data) {
        toast({
          title: "Access Token Refresh failed",
          description: "Failed to fetch emails",
          variant: "destructive",
        });
        throw new Error("Failed to fetch emails");
      }
      if (response.data.success) {
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
            <Button
              variant="ghost"
              className={`w-full flex items-center gap-2 overflow-hidden pr-10 ${
                !sidebarOpen ? "justify-center px-0" : "justify-start px-2"
              }`}
              onClick={() => handleEmailClick(email.email)}
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

            {/* Remove button (hover icon) */}
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={(e) => {
                e.stopPropagation(); // prevent triggering parent click
                handleRemoveEmail(email.email);
              }}
              title="Remove this registered email"
            >
              <MinusCircle className="h-5 w-5 text-red-500 hover:text-red-600" />
            </button>
          </div>
        ))
      )}
    </div>
  );
}
