import { useState, useRef, useEffect } from 'react';
import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Search, Sparkles, X, Loader2, 
  SlidersHorizontal, ChevronDown 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";

interface VectorSearchBarProps {
  onSearch: (query: string, useAI: boolean, filters: SearchFilters) => void;
  isSearching: boolean;
}

interface SearchFilters {
  folder?: string;
  dateRange?: 'today' | 'week' | 'month' | 'year' | 'all';
  hasAttachments?: boolean;
  labelIds?: number[];
}

export function VectorSearchBar({ onSearch, isSearching }: VectorSearchBarProps) {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    folder: undefined,
    dateRange: 'all',
    hasAttachments: false,
    labelIds: [],
  });
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!query.trim() && !useAI) {
      toast({
        variant: "destructive",
        title: "Search query required",
        description: "Please enter a search term or enable AI search",
      });
      return;
    }
    
    onSearch(query, useAI, filters);
  };

  const handleClear = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleAI = () => {
    setUseAI(!useAI);
    if (!useAI) {
      toast({
        title: "AI Search Enabled",
        description: "Using semantic search powered by AI",
      });
    }
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      folder: undefined,
      dateRange: 'all',
      hasAttachments: false,
      labelIds: [],
    });
    setShowFilters(false);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={useAI ? "Describe what you're looking for..." : "Search emails..."}
            className={`pl-10 pr-20 py-2 ${useAI ? 'bg-blue-50' : ''}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          
          <div className="absolute right-2 flex items-center space-x-1">
            {query && (
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            
            <Button
              type="button"
              variant={useAI ? "secondary" : "ghost"}
              size="icon"
              className="h-6 w-6"
              onClick={toggleAI}
              title="Enable AI search"
            >
              <Sparkles className={`h-4 w-4 ${useAI ? 'text-primary' : 'text-muted-foreground'}`} />
            </Button>
            
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  title="Search filters"
                >
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72">
                <div className="space-y-4">
                  <h3 className="font-medium">Search Filters</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="folder">Folder</Label>
                    <Select
                      value={filters.folder || ""}
                      onValueChange={(value) => updateFilter('folder', value || undefined)}
                    >
                      <SelectTrigger id="folder">
                        <SelectValue placeholder="All folders" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All folders</SelectItem>
                        <SelectItem value="inbox">Inbox</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="drafts">Drafts</SelectItem>
                        <SelectItem value="trash">Trash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date-range">Date Range</Label>
                    <Select
                      value={filters.dateRange}
                      onValueChange={(value) => updateFilter('dateRange', value)}
                    >
                      <SelectTrigger id="date-range">
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">Past week</SelectItem>
                        <SelectItem value="month">Past month</SelectItem>
                        <SelectItem value="year">Past year</SelectItem>
                        <SelectItem value="all">All time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="has-attachments" className="cursor-pointer">
                      Has attachments
                    </Label>
                    <Switch
                      id="has-attachments"
                      checked={filters.hasAttachments}
                      onCheckedChange={(checked) => updateFilter('hasAttachments', checked)}
                    />
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={clearFilters}
                    >
                      Clear filters
                    </Button>
                    <Button 
                      type="button" 
                      size="sm"
                      onClick={() => setShowFilters(false)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </form>
      
      {Object.values(filters).some(value => 
        Array.isArray(value) ? value.length > 0 : Boolean(value)
      ) && (
        <div className="flex items-center mt-2 text-xs text-muted-foreground">
          <span>Filters:</span>
          {filters.folder && (
            <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded-full">
              Folder: {filters.folder}
            </span>
          )}
          {filters.dateRange && filters.dateRange !== 'all' && (
            <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded-full">
              Time: {filters.dateRange}
            </span>
          )}
          {filters.hasAttachments && (
            <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded-full">
              Has attachments
            </span>
          )}
        </div>
      )}
      
      {isSearching && (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary mr-2" />
          <span className="text-sm text-muted-foreground">
            {useAI ? 'Searching with AI...' : 'Searching...'}
          </span>
        </div>
      )}
    </div>
  );
}