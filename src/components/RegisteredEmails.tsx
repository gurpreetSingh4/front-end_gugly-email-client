import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import axios from "axios";

interface RegisteredEmail {
  email: string;
  name: string;
}

export function RegisteredEmails({ userId }: { userId: string }) {
  const [emails, setEmails] = useState<RegisteredEmail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
      window.location.href = `${
        import.meta.env.VITE_EMAIL_SERVICE_URL
      }/api/email/google?userId=${userId}&regEmail=${email}`;
    } catch (error) {
      console.error("Error initiating OAuth Gmail:", error);
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
          <Button
            key={email.email}
            variant="outline"
            className="w-full text-left justify-start"
            onClick={() => handleEmailClick(email.email)}
          >
            <div>
              <p className="font-medium">{email.name}</p>
              <p className="text-sm text-gray-500">{email.email}</p>
            </div>
          </Button>
        ))
      )}
    </div>
  );
}
