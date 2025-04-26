import { Button } from '../components/ui/button';
import { 
  ArrowLeft, Archive, AlertTriangle, Trash, Star, 
  Reply, Forward, Download, MoreVertical, Tag
} from 'lucide-react';
import { Email, Label } from '../graphql/schema';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { format } from 'date-fns';

interface EmailDetailProps {
  email: Email;
  labels: Label[];
  onBack: () => void;
  onReply: () => void;
  onForward: () => void;
  onDelete: () => void;
  onStarEmail: (isStarred: boolean) => void;
  onApplyLabel: (labelId: number) => void;
  onRemoveLabel: (labelId: number) => void;
  onMove: (folder: string) => void;
}

export function EmailDetail({ 
  email, 
  labels,
  onBack, 
  onReply, 
  onForward, 
  onDelete,
  onStarEmail,
  onApplyLabel,
  onRemoveLabel,
  onMove
}: EmailDetailProps) {
  const formatEmailDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.getDate() === now.getDate() &&
                    date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear();
    
    if (isToday) {
      return format(date, 'h:mm a');
    } else {
      const formatted = format(date, 'MMM d, yyyy, h:mm a');
      return formatted;
    }
  };

  const formatByteSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(0) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getSenderInitials = () => {
    if (!email.sender.name) return '?';
    return email.sender.name
      .split(' ')
      .map(name => name[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onMove('archive')}>
            <Archive className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onMove('spam')}>
            <AlertTriangle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Tag className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Apply Label</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {labels.map((label) => {
               const hasLabel = Array.isArray(email.labelIds) && email.labelIds.includes(label.id);
                return (
                  <DropdownMenuItem
                    key={label.id}
                    className="flex items-center"
                    onClick={() => hasLabel ? onRemoveLabel(label.id) : onApplyLabel(label.id)}
                  >
                    <span 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: label.color }}
                    />
                    <span>{label.name}</span>
                    {hasLabel && <span className="ml-auto text-xs">✓</span>}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="p-6 flex-1 overflow-y-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-4">{email.subject}</h1>
        
        <div className="flex items-start mb-6">
          <div 
            className="w-10 h-10 rounded-full text-white flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: email.sender.avatar ? 'transparent' : (email.labelIds?.length > 0 && email.labels?.[0]?.color) || '#3b82f6' }}
            >
            {email.sender.avatar ? (
              <img 
                src={email.sender.avatar} 
                alt={email.sender.name} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span>{getSenderInitials()}</span>
            )}
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between flex-wrap">
              <div>
                <p className="font-medium text-foreground">{email.sender.name}</p>
                <p className="text-sm text-muted-foreground">{email.sender.email}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {formatEmailDate(email.date)}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onStarEmail(!email.isStarred)}
                >
                  <Star className={`h-5 w-5 ${email.isStarred ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Reply className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {email.labels && email.labels.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {email.labels.map(label => (
                  <span 
                    key={label.id}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                    style={{ 
                      backgroundColor: `${label.color}20`, // 20% opacity
                      color: label.color 
                    }}
                  >
                    <span 
                      className="w-2 h-2 rounded-full mr-1"
                      style={{ backgroundColor: label.color }}
                    />
                    <span>{label.name}</span>
                  </span>
                ))}
              </div>
            )}
            
            <div 
              className="mt-6 text-foreground space-y-4"
              dangerouslySetInnerHTML={{ __html: email.body }}
            />
            
            {email.attachments && email.attachments.length > 0 && (
              <div className="mt-6 space-y-2">
                {email.attachments.map((attachment, index) => (
                  <div 
                    key={index} 
                    className="border border-border rounded p-3 bg-secondary/30 flex items-center"
                  >
                    <div className="mr-2">
                      <Download className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{attachment.name}</p>
                      <p className="text-xs text-muted-foreground">{formatByteSize(attachment.size)}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-border">
              <Button 
                className="mr-2 flex items-center" 
                onClick={onReply}
              >
                <Reply className="h-4 w-4 mr-1" />
                Reply
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={onForward}
              >
                <Forward className="h-4 w-4 mr-1" />
                Forward
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
