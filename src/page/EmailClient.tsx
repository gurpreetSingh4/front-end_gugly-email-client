import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { EmailList } from "../components/EmailList";
import { EmailDetail } from "../components/EmailDetail";
import { EmailComposer } from "../components/EmailComposer";
import { KeyboardShortcuts } from "../components/KeyboardShortcuts";
import { useMediaQuery } from "../hooks/use-mobile";
import { useEmailClient } from "../hooks/useEmailClient";
import { useToast } from "../hooks/use-toast";
import { Sparkles, Search, ArrowRight } from "lucide-react";


export default function EmailClient() {
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [showComposer, setShowComposer] = useState(false);
  const [currentView, setCurrentView] = useState<"list" | "detail">("list");
  const [isVectorSearching, setIsVectorSearching] = useState(false);
  const [searchMode, setSearchMode] = useState<"regular" | "vector" | "ai">(
    "regular"
  );
  const [searchResults, setSearchResults] = useState<any[] | null>(null);

  const {
    emails,
    selectedEmail,
    labels,
    selectedFolder,
    selectedLabelId,
    activeDraft,
    currentUser,
    allUsers,

    // States
    isLoadingEmails,
    emailsError,
    labelsError,

    // Counts
    unreadCount,
    draftCount,

    // Event handlers
    handleSelectEmail,
    handleSelectFolder,
    handleSelectLabel,
    handleCreateLabel,
    handleDeleteLabel,
    handleStarEmail,
    handleMoveEmail,
    handleApplyLabel,
    handleRemoveLabel,
    handleSearch,
    handleSaveDraft,
    handleSendEmail,
    refreshEmails,
    clearSelectedEmail,
    handleSwitchUser,
  } = useEmailClient();

  // Toggle sidebar on mobile screen size change
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Handle errors with toast
  useEffect(() => {
    if (emailsError) {
      toast({
        variant: "destructive",
        title: "Failed to load emails",
        description: emailsError.message,
      });
    }

    if (labelsError) {
      toast({
        variant: "destructive",
        title: "Failed to load labels",
        description: labelsError.message,
      });
    }
  }, [emailsError, labelsError, toast]);

  const handleReply = () => {
    if (!selectedEmail) return;

    setShowComposer(true);
    handleSaveDraft({
      subject: `Re: ${selectedEmail.subject}`,
      body: `\n\n---------- Original Message ----------\nFrom: ${
        selectedEmail.sender.name
      } <${selectedEmail.sender.email}>\nDate: ${new Date(
        selectedEmail.date
      ).toLocaleString()}\nSubject: ${selectedEmail.subject}\n\n${
        selectedEmail.body
      }`,
      recipients: [selectedEmail.sender.email],
    });
  };

  const handleForward = () => {
    if (!selectedEmail) return;

    setShowComposer(true);
    handleSaveDraft({
      subject: `Fwd: ${selectedEmail.subject}`,
      body: `\n\n---------- Forwarded Message ----------\nFrom: ${
        selectedEmail.sender.name
      } <${selectedEmail.sender.email}>\nDate: ${new Date(
        selectedEmail.date
      ).toLocaleString()}\nSubject: ${selectedEmail.subject}\n\n${
        selectedEmail.body
      }`,
      recipients: [],
    });
  };

  const handleComposeClick = () => {
    setShowComposer(true);
    handleSaveDraft({ subject: "", body: "", recipients: [] });
  };

  // Enhanced search with vector search and AI capabilities
  const handleEnhancedSearch = (
    query: string,
    useAI: boolean,
    // filters: SearchFilters
  ) => {
    setIsVectorSearching(true);
    setSearchMode(useAI ? "ai" : "vector");

    // In a real application, this would call your backend with vector search
    // For demonstration, we're simulating with the existing search function
    setTimeout(() => {
      handleSearch(query);

      // Display notification for the user
      toast({
        title: useAI ? "AI Search Results" : "Vector Search Results",
        description: useAI
          ? "Using AI to find semantically similar content"
          : "Using vector search to find relevant emails",
        variant: "default",
      });

      setIsVectorSearching(false);
    }, 1500);

    // For demonstration, we also set a flag to show vector search results UI
    setSearchResults([]);
  };

  // Function to clear search results and go back to regular email view
  const clearSearchResults = () => {
    setSearchResults(null);
    setSearchMode("regular");
    handleSearch(""); // Clear existing search filter
  };

  // Get the correct email list to display (search results or normal emails)
  const getDisplayedEmails = () => {
    if (searchResults !== null) {
      return searchResults.length === 0 ? [] : searchResults;
    }
    return emails || [];
  };

  // Define keyboard shortcuts for navigation and actions
  const keyboardShortcuts = [
    // Navigation shortcuts
    {
      key: "i",
      description: "Go to Inbox",
      action: () => handleSelectFolder("inbox"),
    },
    {
      key: "s",
      description: "Go to Spam",
      action: () => handleSelectFolder("spam"),
    },
    {
      key: "t",
      description: "Go to Trash",
      action: () => handleSelectFolder("trash"),
    },
    {
      key: "e",
      description: "Go to Sent",
      action: () => handleSelectFolder("sent"),
    },
    {
      key: "d",
      description: "Go to Drafts",
      action: () => handleSelectFolder("drafts"),
    },

    // Action shortcuts
    { key: "c", description: "Compose new email", action: handleComposeClick },
    { key: "r", description: "Reply to email", action: handleReply },
    { key: "f", description: "Forward email", action: handleForward },
    {
      key: "x",
      description: "Delete email",
      action: () => {
        if (selectedEmail) {
          handleMoveEmail(selectedEmail.id, "trash");
          clearSelectedEmail();
          if (isMobile) {
            setCurrentView("list");
          }
        }
      },
    },

    // Account switching shortcuts (if multiple users exist)
    ...(allUsers && allUsers.length > 1
      ? // Generate shortcuts for up to 5 users using number keys 1-5
        allUsers.slice(0, 5).map((user: { name: any; id: number; email: string }, index: number) => ({
          key: `${index + 1}`,
          description: `Switch to ${user.name}`,
          action: () => handleSwitchUser(user.id, user.email),
        }))
      : []),

    // Additional utility shortcuts
    {
      key: "Escape",
      description: "Close composer / Clear selection",
      action: () => {
        if (showComposer) {
          setShowComposer(false);
        } else if (selectedEmail) {
          clearSelectedEmail();
        }
      },
    },
    {
      key: "/",
      description: "Focus search box",
      action: () => {
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) {
          (searchInput as HTMLInputElement).focus();
        }
      },
    },
  ];

  return (
    <div className="h-screen flex flex-col">
      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <Header
        user={currentUser}
        users={allUsers}
        onSearch={handleEnhancedSearch}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        onSwitchUser={handleSwitchUser}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          labels={labels || []}
          selectedFolder={selectedFolder}
          selectedLabelId={selectedLabelId}
          draftCount={draftCount}
          unreadCount={unreadCount}
          onCreateLabel={(label) => handleCreateLabel(label.name)}
          onDeleteLabel={handleDeleteLabel}
          onSelectLabel={handleSelectLabel}
          onSelectFolder={(folder) => {
            handleSelectFolder(folder);
            // Clear any search results when changing folders
            setSearchResults(null);
            setSearchMode("regular");
          }}
          onComposeClick={handleComposeClick}
          className={`${sidebarOpen ? "block" : "hidden"} ${
            isMobile ? "absolute z-20 h-[calc(100vh-64px)] top-16 left-0" : ""
          }`}
        />

        <main className="flex-1 flex overflow-hidden">
          {/* Email List */}
          <div
            className={`
            ${isMobile && currentView === "detail" ? "hidden" : "block"} 
            ${isMobile ? "w-full" : "w-full md:w-1/2 xl:w-2/5"}
          `}
          >
            {/* Vector Search Results Header */}
            {searchMode !== "regular" && (
              <div className="bg-blue-50 p-2 border-b border-blue-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {searchMode === "ai" ? (
                    <Sparkles className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Search className="h-4 w-4 text-blue-600" />
                  )}
                  <span className="text-sm font-medium text-blue-700">
                    {searchMode === "ai"
                      ? "AI-Powered Search Results"
                      : "Vector Search Results"}
                  </span>
                </div>
                <button
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                  onClick={clearSearchResults}
                >
                  Clear Search <ArrowRight className="h-3 w-3 ml-1" />
                </button>
              </div>
            )}

            <EmailList
              emails={getDisplayedEmails()}
              selectedEmailId={selectedEmail?.id}
              labels={labels || []}
              loading={isLoadingEmails || isVectorSearching}
              error={emailsError || null}
              onRefresh={refreshEmails}
              onSelectEmail={(id) => {
                handleSelectEmail(id);
                if (isMobile) {
                  setCurrentView("detail");
                }
              }}
              onStarEmail={handleStarEmail}
            />
          </div>

          {/* Email Detail or Composer */}
          <div
            className={`
            ${isMobile && currentView === "list" ? "hidden" : "block"}
            ${isMobile ? "w-full" : "hidden md:block md:w-1/2 xl:w-3/5"} 
            bg-background overflow-y-auto
          `}
          >
            {showComposer ? (
              <EmailComposer
                draft={activeDraft}
                onClose={() => setShowComposer(false)}
                onSave={handleSaveDraft}
                onSend={handleSendEmail}
              />
            ) : selectedEmail ? (
              <EmailDetail
                email={selectedEmail}
                labels={labels || []}
                onBack={() => {
                  if (isMobile) {
                    setCurrentView("list");
                  }
                  clearSelectedEmail();
                }}
                onReply={handleReply}
                onForward={handleForward}
                onDelete={() => {
                  handleMoveEmail(selectedEmail.id, "trash");
                  clearSelectedEmail();
                  if (isMobile) {
                    setCurrentView("list");
                  }
                }}
                onStarEmail={(isStarred) =>
                  handleStarEmail(selectedEmail.id, isStarred)
                }
                onApplyLabel={(labelId) =>
                  handleApplyLabel(selectedEmail.id, labelId)
                }
                onRemoveLabel={(labelId) =>
                  handleRemoveLabel(selectedEmail.id, labelId)
                }
                onMove={(folder) => {
                  handleMoveEmail(selectedEmail.id, folder);
                  clearSelectedEmail();
                  if (isMobile) {
                    setCurrentView("list");
                  }
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full p-4">
                <p className="text-muted-foreground">Select an email to view</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
