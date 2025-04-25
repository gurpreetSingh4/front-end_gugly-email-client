import { useState } from 'react';
import { Checkbox } from '../components/ui/checkbox';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { 
  ArrowLeft, ArrowRight, MoreVertical, RefreshCcw, 
  Star, StarOff, Search, AlertCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Email, Label } from '../graphql/schema';

interface EmailListProps {
  emails: Email[];
  selectedEmailId?: number;
  labels: Label[];
  loading: boolean;
  error: Error | null;
  onRefresh: () => void;
  onSelectEmail: (id: number) => void;
  onStarEmail: (id: number, isStarred: boolean) => void;
}

export function EmailList({ 
  emails, 
  selectedEmailId, 
  labels,
  loading, 
  error, 
  onRefresh, 
  onSelectEmail,
  onStarEmail
}: EmailListProps) {
  const [selectAll, setSelectAll] = useState(false);
  
  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const formatEmailDate = (dateString: string) => {
    if (!dateString) return ''; // If no date provided, return empty
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // If invalid date, return empty
    const now = new Date();
    const isToday = date.getDate() === now.getDate() &&
                   date.getMonth() === now.getMonth() &&
                   date.getFullYear() === now.getFullYear();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
    
    return formatDistanceToNow(date, { addSuffix: false });
  };
  
  const getPreview = (body: string) => {
    // Strip HTML tags if present
    const textOnly = body.replace(/<[^>]*>/g, '');
    return textOnly.length > 80 ? textOnly.substring(0, 80) + '...' : textOnly;
  };

  return (
    <div className="w-full border-r border-border bg-background overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Checkbox 
              checked={selectAll} 
              onCheckedChange={toggleSelectAll}
              className="h-5 w-5"
            />
            <Button variant="ghost" size="icon" className="h-8 w-8 ml-1">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" onClick={onRefresh} className="h-8 w-8">
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden">
            <Search className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {emails.length > 0 ? `1-${emails.length} of many` : '0 emails'}
          </span>
          <div className="flex ml-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="flex flex-col space-y-4 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Skeleton className="h-5 w-5 rounded" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center h-64 p-4">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <p className="text-destructive font-medium mb-1">Failed to load emails</p>
          <p className="text-sm text-muted-foreground text-center mb-4">Please check your connection and try again</p>
          <Button onClick={onRefresh}>Retry</Button>
        </div>
      )}
      
      {/* Empty State */}
      {!loading && !error && emails.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 p-4">
          <p className="text-lg font-medium mb-1">No emails found</p>
          <p className="text-sm text-muted-foreground text-center">Your inbox is empty</p>
        </div>
      )}
      
      {/* Email List */}
      {!loading && !error && emails.length > 0 && (
        <ul>
          {emails.map((email) => {
            const isSelected = email.id === selectedEmailId;
            
            return (
              <li 
                key={email.id} 
                className={`border-b border-border hover:bg-secondary cursor-pointer transition-colors ${isSelected ? 'bg-secondary/50' : ''}`}
                onClick={() => onSelectEmail(email.id)}
              >
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <Checkbox 
                        className="h-5 w-5"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        <p className="font-semibold text-foreground truncate mr-2">
                          {email.sender.name}
                        </p>
                        <span className="flex-shrink-0 text-xs text-muted-foreground">
                          {formatEmailDate(email.date)}
                        </span>
                      </div>
                      <h3 className="text-sm font-medium text-foreground truncate">
                        {email.subject}
                      </h3>
                      <div className="flex items-center mt-1">
                        {email.labels && email.labels.length > 0 && (
                          <span 
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mr-1"
                            style={{ 
                              backgroundColor: `${email.labels[0].color}20`, // 20% opacity
                              color: email.labels[0].color 
                            }}
                          >
                            <span 
                              className="w-2 h-2 rounded-full mr-1"
                              style={{ backgroundColor: email.labels[0].color }}
                            />
                            <span>{email.labels[0].name}</span>
                          </span>
                        )}
                        <p className="text-sm text-muted-foreground truncate">
                          {getPreview(email.body)}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-2 flex flex-col items-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStarEmail(email.id, !email.isStarred);
                        }}
                      >
                        {email.isStarred ? (
                          <Star className="h-4 w-4 text-yellow-400" />
                        ) : (
                          <StarOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
