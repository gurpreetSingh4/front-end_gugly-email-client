import { useState } from 'react';
import { Button } from '../components/ui/button';
import { 
  Inbox, Star, Clock, Send, FileText, AlertTriangle, 
  Trash, Plus, ChevronDown, Edit, Tag, X 
} from 'lucide-react';
import { Label } from '../graphql/schema';
import { CreateLabelModal } from './CreateLabelModal';

interface SidebarProps {
  labels: Label[];
  selectedFolder: string;
  selectedLabelId?: number;
  draftCount: number;
  unreadCount: number;
  onCreateLabel: (label: { name: string; color: string }) => Promise<void>;
  onDeleteLabel: (id: number) => Promise<void>;
  onSelectLabel: (id: number) => void;
  onSelectFolder: (folder: string) => void;
  onComposeClick: () => void;
  className?: string;
}

export function Sidebar({ 
  labels, 
  selectedFolder, 
  selectedLabelId,
  draftCount, 
  unreadCount, 
  onCreateLabel, 
  onDeleteLabel, 
  onSelectLabel, 
  onSelectFolder,
  onComposeClick,
  className = ""
}: SidebarProps) {
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);

  const defaultFolders = [
    { id: 'inbox', icon: Inbox, label: 'Inbox', count: unreadCount },
    { id: 'starred', icon: Star, label: 'Starred' },
    { id: 'snoozed', icon: Clock, label: 'Snoozed' },
    { id: 'sent', icon: Send, label: 'Sent' },
    { id: 'drafts', icon: FileText, label: 'Drafts', count: draftCount },
    { id: 'spam', icon: AlertTriangle, label: 'Spam' },
    { id: 'trash', icon: Trash, label: 'Trash' },
  ];

  const handleCreateLabel = async (labelData: { name: string; color: string }) => {
    await onCreateLabel(labelData);
    setIsLabelModalOpen(false);
  };

  return (
    <>
      <aside className={`w-64 bg-background border-r border-border flex-shrink-0 overflow-y-auto h-full ${className}`}>
        <div className="p-4">
          <Button
            className="w-full justify-start gap-2"
            onClick={onComposeClick}
          >
            <Edit className="h-4 w-4" />
            Compose
          </Button>
        </div>
        
        <nav className="mt-2">
          <ul>
            {defaultFolders.map((folder) => {
              const Icon = folder.icon;
              const isSelected = selectedFolder === folder.id;
              
              return (
                <li key={folder.id}>
                  <Button
                    variant={isSelected ? "secondary" : "ghost"}
                    className={`w-full justify-start rounded-r-full rounded-l-none px-4 py-2 ${isSelected ? 'bg-secondary' : ''}`}
                    onClick={() => onSelectFolder(folder.id)}
                  >
                    <Icon className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span>{folder.label}</span>
                    {folder.count && folder.count > 0 && (
                      <span className={`ml-auto text-xs rounded-full px-2 py-1 ${isSelected ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-white'}`}>
                        {folder.count}
                      </span>
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
          
          <div className="mt-6 px-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-medium text-muted-foreground">Labels</h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsLabelModalOpen(true)}
              >
                <Plus className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            
            <ul>
              {labels.map((label) => {
                const isSelected = selectedLabelId === label.id;
                
                return (
                  <li key={label.id} className="group relative">
                    <Button
                      variant={isSelected ? "secondary" : "ghost"}
                      className={`w-full justify-start rounded-r-full rounded-l-none px-4 py-2 ${isSelected ? 'bg-secondary' : ''}`}
                      onClick={() => onSelectLabel(label.id)}
                    >
                      <span 
                        className="w-3 h-3 rounded-full mr-3" 
                        style={{ backgroundColor: label.color }}
                      />
                      <span>{label.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto opacity-0 group-hover:opacity-100 h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteLabel(label.id);
                        }}
                      >
                        <X className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </aside>
      
      <CreateLabelModal
        isOpen={isLabelModalOpen}
        onClose={() => setIsLabelModalOpen(false)}
        onCreateLabel={handleCreateLabel}
      />
    </>
  );
}
