import { useEffect, useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle,
  SheetTrigger 
} from "../components/ui/sheet";
import { KeyboardIcon } from 'lucide-react';
import { Button } from '../components/ui/button';

interface ShortcutMapping {
  key: string;
  description: string;
  action: () => void;
}

interface KeyboardShortcutsProps {
  shortcuts: ShortcutMapping[];
  onToggleHelp: () => void;
  showHelp: boolean;
}

// Helper component to display a keyboard key
const KeyCap = ({ children }: { children: React.ReactNode }) => (
  <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
    {children}
  </kbd>
);

export function KeyboardShortcutsHelp({ 
  shortcuts, 
  onToggleHelp, 
  showHelp 
}: KeyboardShortcutsProps) {
  return (
    <Sheet open={showHelp} onOpenChange={onToggleHelp}>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Keyboard Shortcuts</SheetTitle>
          <SheetDescription>
            Press the following keys to quickly navigate and perform actions
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Navigation</h3>
            <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
              {shortcuts
                .filter(shortcut => shortcut.description.includes('Go to') || shortcut.description.includes('Switch'))
                .map((shortcut, i) => (
                  <div key={i} className="contents">
                    <div className="flex items-center">
                      <KeyCap>{shortcut.key}</KeyCap>
                    </div>
                    <div className="text-muted-foreground">
                      {shortcut.description}
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Actions</h3>
            <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
              {shortcuts
                .filter(shortcut => !shortcut.description.includes('Go to') && !shortcut.description.includes('Switch'))
                .map((shortcut, i) => (
                  <div key={i} className="contents">
                    <div className="flex items-center">
                      <KeyCap>{shortcut.key}</KeyCap>
                    </div>
                    <div className="text-muted-foreground">
                      {shortcut.description}
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function KeyboardShortcuts({ shortcuts }: { shortcuts: ShortcutMapping[] }) {
  const [showHelp, setShowHelp] = useState(false);

  // Set up the keyboard event listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if we're inside an input field
      if (
        event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Check if the key pressed matches any of our shortcuts
      const shortcut = shortcuts.find(s => s.key.toLowerCase() === event.key.toLowerCase());
      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }

      // Special case for '?' key to show help
      if (event.key === '?') {
        event.preventDefault();
        setShowHelp(!showHelp);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, showHelp]);

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed bottom-4 right-4 z-50 bg-background shadow"
        onClick={() => setShowHelp(!showHelp)}
      >
        <KeyboardIcon className="h-5 w-5" />
      </Button>
      
      <KeyboardShortcutsHelp 
        shortcuts={shortcuts} 
        onToggleHelp={() => setShowHelp(!showHelp)}
        showHelp={showHelp}
      />
    </>
  );
}