import { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Minimize, X, PaperclipIcon, Link2, Smile, Lightbulb, Loader2, Sparkles } from "lucide-react";
import { Draft } from "../graphql/schema";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { generateNextSentenceSuggestions, generateEmailContent } from "../lib/openai-service";

interface EmailComposerProps {
  draft?: Draft;
  onClose: () => void;
  onSave: (draft: {
    subject?: string;
    body?: string;
    recipients: string[];
  }) => Promise<void>;
  onSend: () => Promise<void>;
}

export function EmailComposer({ draft, onClose }: EmailComposerProps) {
  const [recipients, setRecipients] = useState<string>(draft?.recipients?.join(", ") || "");
  const [subject, setSubject] = useState<string>(draft?.subject || "");
  const [body, setBody] = useState<string>(draft?.body || "");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [iconPos, setIconPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [showAiIcon] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === "Space") {
        e.preventDefault();
        fetchSuggestions();
      }

      if (!showAutoComplete || suggestions.length === 0) return;

      if (e.key === "Tab") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const suggestion = suggestions[selectedIndex];
        if (suggestion) insertSuggestion(suggestion);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [suggestions, showAutoComplete, selectedIndex]);

  const updateCursorPosition = () => {
    if (!textareaRef.current) return;
    const selectionStart = textareaRef.current.selectionStart;
    const text = textareaRef.current.value.substring(0, selectionStart);
    const lines = text.split("\n");
    const top = lines.length * 20 - 16;
    const left = lines[lines.length - 1].length * 7 + 10;
    setIconPos({ top, left });
  };

  const fetchSuggestions = async () => {
    const cursorPos = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = body.substring(0, cursorPos);
    const results = await generateNextSentenceSuggestions(textBeforeCursor, subject);
    if (results.length > 0) {
      setSuggestions(results);
      setSelectedIndex(0);
      setShowAutoComplete(true);
    }
  };

  const insertSuggestion = async (suggestion: string) => {
    const cursorPos = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = body.substring(0, cursorPos);
    const lastSpacePos = textBeforeCursor.lastIndexOf(' ');
    const beforeText = body.substring(0, lastSpacePos + 1);
    const afterText = body.substring(cursorPos);

    const chars = suggestion.split("");
    let currentText = beforeText;

    for (let i = 0; i < chars.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 15 + Math.random() * 25));
      currentText += chars[i];
      setBody(currentText + afterText);
    }

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = beforeText.length + suggestion.length;
        textareaRef.current.selectionStart = newCursorPos;
        textareaRef.current.selectionEnd = newCursorPos;
      }
      setShowAutoComplete(false);
      setSuggestions([]);
      setSelectedIndex(0);
    }, 0);
  };

  const generateAIResponse = async () => {
    setAiGenerating(true);
    try {
      const aiText = await generateEmailContent(subject, body, "professional");
      const subjectMatch = aiText.match(/^Subject:\s*(.*)/);
      const subjectExtracted = subjectMatch ? subjectMatch[1].trim() : "No Subject";
      const bodyStartIndex = aiText.indexOf("Dear ");
      const bodyExtracted = bodyStartIndex !== -1 ? aiText.substring(bodyStartIndex).trim() : aiText.trim();

      setSubject(subjectExtracted);
      setBody("");
      const chars = bodyExtracted.split("");
      for (let i = 0; i < chars.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 10 + Math.random() * 30));
        setBody((prev) => prev + chars[i]);
        if (i % 15 === 0 && i > 0) await new Promise((resolve) => setTimeout(resolve, 80 + Math.random() * 100));
      }
    } catch (error) {
      console.error("Failed to generate AI response:", error);
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-medium text-foreground">New Message</h2>
        <div>
          <Button variant="ghost" size="icon"><Minimize className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <Input placeholder="To" value={recipients} onChange={(e) => setRecipients(e.target.value)} className="mb-4 border-b border-border rounded-none px-3 py-2" />
        <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="mb-4 border-b border-border rounded-none px-3 py-2" />

        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            placeholder="Compose email"
            className="w-full h-full resize-none border-0 p-3"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onClick={updateCursorPosition}
            onKeyUp={updateCursorPosition}
          />

          {showAiIcon && (
            <div
              className="absolute z-10 cursor-pointer transition-opacity duration-200 opacity-40 hover:opacity-100"
              style={{ top: iconPos.top, left: iconPos.left }}
              title="Press Ctrl + Space or click to get AI suggestions"
              onClick={fetchSuggestions}
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
            </div>
          )}

          {showAutoComplete && (
            <div className="absolute bottom-2 left-3 right-3 bg-background shadow-lg rounded-md border border-border z-10">
              <div className="p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground font-semibold">Suggestions</span>
                </div>
                <ul className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className={`text-sm px-2 py-1 flex items-center rounded cursor-pointer text-foreground ${
                        index === selectedIndex
                          ? "bg-blue-500 text-white ring-2 ring-blue-400"
                          : "hover:bg-secondary"
                      }`}
                      onClick={() => insertSuggestion(suggestion)}
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
            <Button variant="ghost" size="icon"><PaperclipIcon className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon"><Link2 className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon"><Smile className="h-5 w-5" /></Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon"><Lightbulb className="h-5 w-5 text-amber-500" /></Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">AI Assistance</h3>
                  <p className="text-xs text-muted-foreground">Generate an email response using AI</p>
                  <Button className="w-full" size="sm" onClick={generateAIResponse} disabled={aiGenerating}>
                    {aiGenerating ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" /> Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3 mr-2" /> Generate Response
                      </>
                    )}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">Save as Draft</Button>
            <Button disabled={!recipients.trim()}>Send</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
