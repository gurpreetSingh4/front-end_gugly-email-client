import { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { 
  Minimize, X, PaperclipIcon, Link2, Smile, 
  Lightbulb, Loader2, Sparkles
} from 'lucide-react';
import { Draft } from '../graphql/schema';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '../components/ui/popover';

interface EmailComposerProps {
  draft?: Draft;
  onClose: () => void;
  onSave: (draft: { subject?: string; body?: string; recipients: string[] }) => Promise<void>;
  onSend: () => Promise<void>;
}

// Simulated completions that would come from the OpenAI API
const simulateCompletions = async (text: string): Promise<string[]> => {
  // This function simulates API calls
  // In production, this would be replaced with a real API call to your backend
  // which would then call OpenAI or your vector database

  // Add a small delay to simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!text.trim()) return [];
  
  // Simple simulation of auto-complete suggestions
  const lastWord = text.split(' ').pop() || '';
  
  if (lastWord.length < 2) return [];
  
  // Sample suggestions based on the last word typed
  if (lastWord.toLowerCase().startsWith('meet')) {
    return [
      "meeting at 3pm tomorrow",
      "meeting to discuss project milestones",
      "meeting agenda attached for your review"
    ];
  } else if (lastWord.toLowerCase().startsWith('thank')) {
    return [
      "thank you for your prompt response",
      "thank you for your consideration", 
      "thank you for the detailed information"
    ];
  } else if (lastWord.toLowerCase().startsWith('plea')) {
    return [
      "please let me know if you have any questions",
      "please review the attached document",
      "please confirm receipt of this email"
    ];
  } else if (lastWord.toLowerCase().startsWith('att')) {
    return [
      "attached is the document you requested",
      "attention to the deadline approaching",
      "attached are the meeting minutes"
    ];
  }
  
  return [];
};

export function EmailComposer({ draft, onClose, onSave, onSend }: EmailComposerProps) {
  const [recipients, setRecipients] = useState<string>(draft?.recipients?.join(', ') || '');
  const [subject, setSubject] = useState<string>(draft?.subject || '');
  const [body, setBody] = useState<string>(draft?.body || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionTimeout = useRef<NodeJS.Timeout | null>(null);

  // Auto-save draft when content changes
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (recipients || subject || body) {
        handleSaveDraft();
      }
    }, 2000);
    
    return () => clearTimeout(autoSaveTimer);
  }, [recipients, subject, body]);

  // Fetch suggestions as user types
  useEffect(() => {
    // Clear any existing timeout
    if (suggestionTimeout.current) {
      clearTimeout(suggestionTimeout.current);
    }

    // Skip if body is empty
    if (!body.trim()) {
      setSuggestions([]);
      setShowAutoComplete(false);
      return;
    }

    // Set a timeout to avoid fetching on every keystroke
    suggestionTimeout.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        // In a real app, this would call your backend API
        const completions = await simulateCompletions(body);
        setSuggestions(completions);
        setShowAutoComplete(completions.length > 0);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      if (suggestionTimeout.current) {
        clearTimeout(suggestionTimeout.current);
      }
    };
  }, [body]);

  const handleSaveDraft = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const recipientsArray = recipients
        .split(',')
        .map(email => email.trim())
        .filter(email => email !== '');
      
      await onSave({
        subject: subject || undefined,
        body: body || undefined,
        recipients: recipientsArray,
      });
    } catch (error) {
      console.error('Failed to save draft:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendEmail = async () => {
    if (isSending) return;
    
    setIsSending(true);
    try {
      // Save draft first
      await handleSaveDraft();
      
      // Then send
      await onSend();
      
      // Close composer after sending
      onClose();
    } catch (error) {
      console.error('Failed to send email:', error);
    } finally {
      setIsSending(false);
    }
  };

  const applySuggestion = async (suggestion: string) => {
    // Get cursor position
    const cursorPos = textareaRef.current?.selectionStart || 0;
    
    // Find the start of the current word
    const textBeforeCursor = body.substring(0, cursorPos);
    const lastSpacePos = textBeforeCursor.lastIndexOf(' ');
    
    // Get text before the last word and after the cursor
    const beforeText = body.substring(0, lastSpacePos + 1);
    const afterText = body.substring(cursorPos);
    
    // Animate typing the suggested text
    setShowAutoComplete(false);
    
    // Type the suggestion character by character
    const chars = suggestion.split('');
    let currentText = beforeText;
    
    for (let i = 0; i < chars.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 15 + Math.random() * 25)); // Random delay between 15-40ms
      currentText += chars[i];
      setBody(currentText + afterText);
    }
    
    // Focus back on textarea at the end of the suggestion
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = (lastSpacePos + 1) + suggestion.length;
        textareaRef.current.selectionStart = newCursorPos;
        textareaRef.current.selectionEnd = newCursorPos;
      }
    }, 0);
  };

  const generateAIResponse = async () => {
    // In a real implementation, this would call your backend
    // which would then use OpenAI to generate a response
    setAiGenerating(true);
    
    try {
      // Simulate API delay for initial thinking time
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample AI-generated text based on the subject
      let aiText = "";
      
      if (subject.toLowerCase().includes('meeting')) {
        aiText = "Thank you for your meeting request. I'm available on Monday and Tuesday afternoons next week. Please let me know which day works best for you, and I'll send a calendar invite.\n\nBest regards,\nJohn";
      } else if (subject.toLowerCase().includes('report')) {
        aiText = "Thank you for requesting the report. I've attached the latest version for your review. Please note that the Q3 numbers are still preliminary and subject to change.\n\nPlease let me know if you have any questions or need additional information.\n\nBest regards,\nJohn";
      } else if (subject.toLowerCase().includes('question')) {
        aiText = "Thanks for reaching out with your question. I'd be happy to help clarify this matter.\n\nCould you please provide a bit more detail about your specific concern so I can give you the most accurate information?\n\nBest regards,\nJohn";
      } else {
        aiText = "Thank you for your email. I've received your message and will review it shortly. If this requires immediate attention, please feel free to call me at my office number.\n\nBest regards,\nJohn";
      }
      
      // Animate the text generation character by character
      setBody(""); // Clear existing content
      
      const chars = aiText.split('');
      for (let i = 0; i < chars.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 10 + Math.random() * 30)); // Random delay between 10-40ms
        setBody(prev => prev + chars[i]);
        
        // Occasionally add a slightly longer pause to simulate thinking
        if (i % 15 === 0 && i > 0) {
          await new Promise(resolve => setTimeout(resolve, 80 + Math.random() * 100));
        }
      }
    } catch (error) {
      console.error('Failed to generate AI response:', error);
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-medium text-foreground">New Message</h2>
        <div>
          <Button variant="ghost" size="icon">
            <Minimize className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-4">
          <Input
            placeholder="To"
            className="border-b border-t-0 border-l-0 border-r-0 border-border rounded-none focus-visible:ring-0 px-3 py-2"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Input
            placeholder="Subject"
            className="border-b border-t-0 border-l-0 border-r-0 border-border rounded-none focus-visible:ring-0 px-3 py-2"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            placeholder="Compose email"
            className="w-full h-full resize-none border-0 focus-visible:ring-0 p-3"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          
          {/* Auto-completion suggestions */}
          {showAutoComplete && (
            <div className="absolute bottom-2 left-3 right-3 bg-background shadow-lg rounded-md border border-border z-10">
              <div className="p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground font-semibold">Suggestions</span>
                  {isLoading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                </div>
                <ul className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <li 
                      key={index} 
                      className="text-sm px-2 py-1 hover:bg-secondary rounded cursor-pointer flex items-center text-foreground"
                      onClick={() => applySuggestion(suggestion)}
                    >
                      <Sparkles className="h-3 w-3 mr-2 text-primary" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-center border-t border-border pt-4">
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <PaperclipIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Link2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Smile className="h-5 w-5" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">AI Assistance</h3>
                  <p className="text-xs text-muted-foreground">Generate an email response using AI</p>
                  <Button 
                    className="w-full"
                    size="sm"
                    onClick={generateAIResponse}
                    disabled={aiGenerating}
                  >
                    {aiGenerating ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3 mr-2" />
                        Generate Response
                      </>
                    )}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button 
              onClick={handleSendEmail}
              disabled={isSending || !recipients.trim()}
            >
              {isSending ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
