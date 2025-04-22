import { useState, useEffect } from "react";
import { useAuth } from "../hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import axios from "axios";
import { 
  Mail, Inbox, Send, Star, File, Trash2, Menu, 
  Search, Plus, Settings, User, LogOut, SunMoon,
  RefreshCcw, Archive, Paperclip, MoreHorizontal,
  Calendar, Clock, CheckCircle, Loader2
} from "lucide-react";
import { apiRequest, queryClient } from "../lib/queryClient";
import { generateEmailContent, completeEmailText, generateReplySuggestions } from "../lib/openai-service";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { ScrollArea } from "../components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { ThemeToggle } from "../components/ui/theme-toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { useToast } from "../hooks/use-toast";

// Email interface types
interface EmailHeader {
  name: string;
  value: string;
}

interface EmailPayload {
  mimeType: string;
  headers: EmailHeader[];
  body?: {
    data?: string;
    size?: number;
  };
  parts?: EmailPayload[];
}

interface Email {
  id: string;
  threadId: string;
  labelIds?: string[];
  snippet?: string;
  historyId?: string;
  internalDate?: string;
  payload?: EmailPayload;
}

interface GmailLabel {
  id: string;
  name: string;
  type: string;
  messageListVisibility?: string;
  labelListVisibility?: string;
}

// Component for connecting to Gmail
const GmailConnect = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const connectGmail = async () => {
    try {
      setIsConnecting(true);
      const response = await apiRequest('GET', `/api/email/google?userId=${user?.id}&regEmail=${user?.email}`);
      if (response.ok) {
        // The response might be a redirect URL to Google OAuth
        const data = await response.json();
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else {
          toast({
            title: "Success",
            description: "Gmail connected successfully!"
          });
          onSuccess();
        }
      } else {
        toast({
          variant: "destructive",
          title: "Connection failed",
          description: "Could not connect to Gmail. Please try again."
        });
      }
    } catch (error) {
      console.error("Gmail connection error:", error);
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "An error occurred while connecting to Gmail."
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <Mail className="h-16 w-16 mb-6 text-primary" />
      <h2 className="text-2xl font-bold mb-3">Connect Your Gmail Account</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-md">
        Connect your Gmail account to use SmartMail's AI-powered features for email management.
      </p>
      <Button 
        size="lg" 
        onClick={connectGmail}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Mail className="mr-2 h-5 w-5" />
            Connect Gmail
          </>
        )}
      </Button>
    </div>
  );
};

// Component for composing a new email
const ComposeEmail = ({ onClose }: { onClose: () => void }) => {
  const { toast } = useToast();
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  const createDraftMutation = useMutation({
    mutationFn: async (draftData: { to: string[], cc?: string[], bcc?: string[], subject: string, body: string }) => {
      const res = await apiRequest('POST', '/api/graphql', {
        query: `
          mutation CreateDraft($input: GmailDraftInput!) {
            createGmailDraft(input: $input) {
              id
              message {
                id
                threadId
              }
            }
          }
        `,
        variables: {
          input: draftData
        }
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create draft");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Draft saved",
        description: "Your email draft has been saved."
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to save draft",
        description: error.message
      });
    }
  });

  const generateWithAI = async () => {
    try {
      setIsGenerating(true);
      const currentContent = body;
      let displayedContent = currentContent;
      setBody(displayedContent);

      // Call OpenAI API to generate email content
      const generatedContent = await generateEmailContent(
        subject,
        `This email is being sent to ${to}. ${currentContent ? `Context from current draft: ${currentContent}` : ""}`,
        "professional"
      );

      // Simulate streaming effect
      const words = generatedContent.split(' ');
      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 50)); // Adjust speed here
        displayedContent = (currentContent ? currentContent + "\n\n" : "") + 
          words.slice(0, i + 1).join(' ');
        setBody(displayedContent);
      }

      toast({
        title: "AI text generated",
        description: "Text has been added to your email."
      });
    } catch (error) {
      console.error("AI generation error:", error);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "Failed to generate text. Please try again."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = () => {
    if (!to) {
      toast({
        variant: "destructive",
        title: "Recipient required",
        description: "Please add at least one recipient."
      });
      return;
    }

    const draftData = {
      to: to.split(",").map(email => email.trim()),
      cc: cc ? cc.split(",").map(email => email.trim()) : undefined,
      bcc: bcc ? bcc.split(",").map(email => email.trim()) : undefined,
      subject,
      body
    };

    createDraftMutation.mutate(draftData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold">New Message</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </div>
        <div className="p-4 flex-1 overflow-auto">
          <div className="space-y-4">
            <div>
              <div className="flex items-center">
                <Input 
                  type="text" 
                  placeholder="To" 
                  value={to} 
                  onChange={(e) => setTo(e.target.value)}
                  className="border-0 focus-visible:ring-0 px-0"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setShowCc(true);
                    setShowBcc(true);
                  }}
                  className="text-xs"
                >
                  Cc/Bcc
                </Button>
              </div>
              <Separator className="my-2" />
            </div>
            
            {showCc && (
              <div>
                <Input 
                  type="text" 
                  placeholder="Cc" 
                  value={cc} 
                  onChange={(e) => setCc(e.target.value)}
                  className="border-0 focus-visible:ring-0 px-0"
                />
                <Separator className="my-2" />
              </div>
            )}
            
            {showBcc && (
              <div>
                <Input 
                  type="text" 
                  placeholder="Bcc" 
                  value={bcc} 
                  onChange={(e) => setBcc(e.target.value)}
                  className="border-0 focus-visible:ring-0 px-0"
                />
                <Separator className="my-2" />
              </div>
            )}
            
            <div>
              <Input 
                type="text" 
                placeholder="Subject" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                className="border-0 focus-visible:ring-0 px-0"
              />
              <Separator className="my-2" />
            </div>
            
            <Textarea 
              placeholder="Write your message here..." 
              value={body} 
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[200px] border-0 focus-visible:ring-0 px-0 resize-none"
            />
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <div className="flex gap-2">
            <Button onClick={handleSaveDraft} disabled={createDraftMutation.isPending}>
              {createDraftMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save as Draft"
              )}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Discard
            </Button>
          </div>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" disabled={isGenerating} onClick={generateWithAI}>
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate with AI</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Attach file</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

// Email list item component
const EmailListItem = ({ 
  email, 
  isSelected, 
  onClick 
}: { 
  email: Email; 
  isSelected: boolean; 
  onClick: () => void;
}) => {
  // Extract sender name and subject from email headers
  const getHeaderValue = (name: string): string => {
    if (!email.payload || !email.payload.headers) return '';
    const header = email.payload.headers.find(h => h.name.toLowerCase() === name.toLowerCase());
    return header ? header.value : '';
  };

  const sender = getHeaderValue('From');
  const subject = getHeaderValue('Subject');
  const date = getHeaderValue('Date');
  
  // Format the date for display
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    
    const emailDate = new Date(dateStr);
    const today = new Date();
    
    // Check if the email is from today
    if (emailDate.toDateString() === today.toDateString()) {
      return emailDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Otherwise show the date
    return emailDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Extract sender name from email address (e.g., "John Doe <john@example.com>" -> "John Doe")
  const getSenderName = (from: string): string => {
    const match = from.match(/^"?([^"<]+)"?\s*<?[^>]*>?$/);
    return match ? match[1].trim() : from;
  };

  const isRead = !email.labelIds?.includes('UNREAD');
  
  return (
    <div 
      className={`
        flex items-start p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer
        ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
        ${!isRead ? 'font-semibold' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex-shrink-0 mr-3">
        <Avatar className="w-8 h-8">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            {getSenderName(sender).charAt(0).toUpperCase()}
          </div>
        </Avatar>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <p className={`text-sm truncate ${!isRead ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
            {getSenderName(sender)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            {formatDate(date)}
          </p>
        </div>
        <p className={`text-sm truncate ${!isRead ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
          {subject}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {email.snippet}
        </p>
      </div>
    </div>
  );
};

// Email detail view component
const EmailDetail = ({ 
  email, 
  onBack 
}: { 
  email: Email; 
  onBack: () => void;
}) => {
  const getHeaderValue = (name: string): string => {
    if (!email.payload || !email.payload.headers) return '';
    const header = email.payload.headers.find(h => h.name.toLowerCase() === name.toLowerCase());
    return header ? header.value : '';
  };

  const sender = getHeaderValue('From');
  const recipient = getHeaderValue('To');
  const subject = getHeaderValue('Subject');
  const date = getHeaderValue('Date');
  
  // Format the date for display
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Decode and extract email body
  const getEmailBody = (): string => {
    if (!email.payload) return '';
    
    // Function to decode base64 content
    const decodeBase64 = (data: string) => {
      try {
        // Handle URL-safe base64 encoding
        const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
        return decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
      } catch (e) {
        console.error('Error decoding email body:', e);
        return 'Unable to display email content';
      }
    };
    
    // Check if email body is in the main part
    if (email.payload.body && email.payload.body.data) {
      return decodeBase64(email.payload.body.data);
    }
    
    // Check if email body is in a multipart message
    if (email.payload.parts) {
      // Look for text/plain or text/html parts
      const textPart = email.payload.parts.find(part => 
        part.mimeType === 'text/plain' && part.body && part.body.data
      );
      
      const htmlPart = email.payload.parts.find(part => 
        part.mimeType === 'text/html' && part.body && part.body.data
      );
      
      // Prefer plain text, use HTML as fallback
      if (textPart && textPart.body && textPart.body.data) {
        return decodeBase64(textPart.body.data);
      } else if (htmlPart && htmlPart.body && htmlPart.body.data) {
        // For HTML content, we could use a sanitizer here
        // For simplicity, we're just showing it directly
        const html = decodeBase64(htmlPart.body.data);
        return html; // In a real app, you'd want to sanitize this
      }
    }
    
    return 'No content available';
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
        <h2 className="text-lg font-semibold truncate">{subject}</h2>
      </div>
      
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            <Avatar className="mr-3 w-10 h-10">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {sender.charAt(0).toUpperCase()}
              </div>
            </Avatar>
            <div>
              <p className="font-semibold">{sender}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                To: {recipient}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(date)}
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="prose dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: getEmailBody() }} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex space-x-2">
        <Button variant="outline">
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 16l-4-4m0 0l4-4m-4 4h18M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Reply
        </Button>
        <Button variant="outline">
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m10 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Forward
        </Button>
      </div>
    </div>
  );
};

export default function EmailDashboard() {
  const { user, logoutMutation } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Check if Gmail is connected
  useEffect(() => {
    const checkGmailConnection = async () => {
      try {
        const response = await apiRequest('GET', '/api/auth/user');
        if (response.ok) {
          const userData = await response.json();
          // This would depend on how your backend indicates Gmail connection status
          setIsGmailConnected(userData.isGmailConnected || false);
        }
      } catch (error) {
        console.error("Error checking Gmail connection:", error);
      }
    };
    
    checkGmailConnection();
  }, []);

  // Query to get labels
  const labelsQuery = useQuery({
    queryKey: ['/api/labels'],
    queryFn: async () => {
      try {
        // Use GraphQL endpoint to retrieve Gmail labels
        const response = await apiRequest('POST', '/api/graphql', {
          query: `
            query {
              listGmailLabels {
                id
                name
                type
                messageListVisibility
                labelListVisibility
              }
            }
          `
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch labels');
        }
        
        const data = await response.json();
        return data.data.listGmailLabels;
      } catch (error) {
        console.error("Error fetching labels:", error);
        return [];
      }
    },
    enabled: isGmailConnected
  });

  // Query to get messages
  const messagesQuery = useQuery({
    queryKey: ['/api/messages', activeTab],
    queryFn: async () => {
      try {
        let query = '';
        
        // Build the query based on the active tab
        switch (activeTab) {
          case 'inbox':
            query = 'in:inbox';
            break;
          case 'sent':
            query = 'in:sent';
            break;
          case 'starred':
            query = 'is:starred';
            break;
          case 'drafts':
            query = 'in:drafts';
            break;
          case 'trash':
            query = 'in:trash';
            break;
          default:
            query = 'in:inbox';
        }
        
        // Use GraphQL endpoint to retrieve Gmail messages
        const response = await apiRequest('POST', '/api/graphql', {
          query: `
            query GetMessages($input: GmailMessageQueryInput) {
              listGmailMessages(input: $input) {
                messages {
                  id
                  threadId
                  labelIds
                  snippet
                  historyId
                  internalDate
                  payload {
                    mimeType
                    headers {
                      name
                      value
                    }
                  }
                }
                nextPageToken
                resultSizeEstimate
              }
            }
          `,
          variables: {
            input: {
              query,
              maxResults: 20
            }
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        
        const data = await response.json();
        return data.data.listGmailMessages.messages || [];
      } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
      }
    },
    enabled: isGmailConnected
  });

  // Function to get a specific email when selected
  const getEmailDetail = async (emailId: string) => {
    try {
      const response = await apiRequest('POST', '/api/graphql', {
        query: `
          query GetMessage($id: String!) {
            getGmailMessage(id: $id) {
              id
              threadId
              labelIds
              snippet
              historyId
              internalDate
              payload {
                mimeType
                headers {
                  name
                  value
                }
                body {
                  data
                  size
                }
                parts {
                  mimeType
                  headers {
                    name
                    value
                  }
                  body {
                    data
                    size
                  }
                }
              }
            }
          }
        `,
        variables: {
          id: emailId
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch email details');
      }
      
      const data = await response.json();
      return data.data.getGmailMessage;
    } catch (error) {
      console.error("Error fetching email details:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load email details."
      });
      return null;
    }
  };

  const handleEmailClick = async (email: Email) => {
    const emailDetail = await getEmailDetail(email.id);
    if (emailDetail) {
      setSelectedEmail(emailDetail);
    }
  };

  const renderSidebarContent = () => {
    const systemLabels = [
      { id: 'inbox', name: 'Inbox', icon: <Inbox className="h-5 w-5 mr-3" /> },
      { id: 'starred', name: 'Starred', icon: <Star className="h-5 w-5 mr-3" /> },
      { id: 'sent', name: 'Sent', icon: <Send className="h-5 w-5 mr-3" /> },
      { id: 'drafts', name: 'Drafts', icon: <File className="h-5 w-5 mr-3" /> },
      { id: 'trash', name: 'Trash', icon: <Trash2 className="h-5 w-5 mr-3" /> }
    ];
    
    const userLabels = labelsQuery.data?.filter((label: { type: string; labelListVisibility: string; }) => 
      label.type === 'user' && 
      label.labelListVisibility !== 'labelHide'
    ) || [];

    return (
      <>
        <div className="flex items-center p-4 h-16">
          {sidebarOpen ? (
            <div className="flex items-center space-x-2">
              <Mail className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">SmartMail</span>
            </div>
          ) : (
            <Mail className="h-6 w-6 text-primary mx-auto" />
          )}
        </div>

        <Button
          onClick={() => setIsComposeOpen(true)}
          className="mx-4 my-4"
        >
          <Plus className="h-4 w-4 mr-2" />
          {sidebarOpen ? "Compose" : ""}
        </Button>

        <nav className="flex-1 p-4 space-y-2">
          {systemLabels.map((label) => (
            <Button 
              key={label.id}
              variant={activeTab === label.id ? "default" : "ghost"} 
              className={`w-full justify-start ${!sidebarOpen && "justify-center px-0"}`}
              onClick={() => setActiveTab(label.id)}
            >
              {label.icon}
              {sidebarOpen && <span>{label.name}</span>}
            </Button>
          ))}
          
          {sidebarOpen && userLabels.length > 0 && (
            <>
              <Separator className="my-4" />
              <h3 className="text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">
                Labels
              </h3>
              {userLabels.map((label: GmailLabel) => (
                <Button 
                  key={label.id}
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => {
                    // Handle user label click
                    toast({
                      title: "Label selected",
                      description: `${label.name} selected`
                    });
                  }}
                >
                  <div className="w-3 h-3 rounded-full bg-primary mr-3"></div>
                  <span>{label.name}</span>
                </Button>
              ))}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="ghost" onClick={toggleSidebar} className="w-full justify-start">
            <Menu className="h-5 w-5 mr-3" />
            {sidebarOpen && <span>Collapse</span>}
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } hidden md:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300`}
      >
        {renderSidebarContent()}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="md:hidden flex items-center space-x-2">
              <Mail className="h-6 w-6 text-primary" />
              <span className="font-semibold">SmartMail</span>
            </div>
            <div className="hidden md:flex relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search emails..."
                className="pl-10 max-w-[400px] bg-gray-50 dark:bg-gray-700"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-white">
                    {user?.fullName ? user.fullName[0] : user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.fullName || 'User'}</p>
                    <p className="text-xs leading-none text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-gray-800/50 dark:bg-black/50">
            <div className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg">
              {renderSidebarContent()}
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
          {!isGmailConnected ? (
            <GmailConnect onSuccess={() => setIsGmailConnected(true)} />
          ) : (
            selectedEmail ? (
              <EmailDetail 
                email={selectedEmail} 
                onBack={() => setSelectedEmail(null)} 
              />
            ) : (
              <div className="flex flex-col h-full">
                <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                  <h1 className="text-xl font-bold capitalize">{activeTab}</h1>
                  <Button variant="ghost" size="sm" onClick={() => messagesQuery.refetch()}>
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </div>
                
                <ScrollArea className="flex-1">
                  {messagesQuery.isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : messagesQuery.isError ? (
                    <div className="p-4 text-center text-red-500">
                      Failed to load emails. Please try again.
                    </div>
                  ) : messagesQuery.data?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
                      <Mail className="h-10 w-10 mb-2 opacity-60" />
                      <p>No emails found in {activeTab}</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {(messagesQuery.data || []).map((email: Email) => (
                        <EmailListItem
                          key={email.id}
                          email={email}
                          isSelected={selectedEmail?.id === email.id}
                          onClick={() => handleEmailClick(email)}
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            )
          )}
        </main>
      </div>
      
      {/* Compose Email Modal */}
      {isComposeOpen && (
        <ComposeEmail onClose={() => setIsComposeOpen(false)} />
      )}
    </div>
  );
}