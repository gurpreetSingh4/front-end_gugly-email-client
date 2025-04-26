import { useState } from 'react';
import { Button } from '../components/ui/button';
import { 
  Mail, Search, HelpCircle, Settings, 
  Menu, ChevronDown
} from 'lucide-react';
import { useMediaQuery } from '../hooks/use-mobile';
import { VectorSearchBar } from './VectorSearchBar';
import { ThemeToggle } from './ThemeToggle';
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface SearchFilters {
  folder?: string;
  dateRange?: 'today' | 'week' | 'month' | 'year' | 'all';
  hasAttachments?: boolean;
  labelIds?: number[];
}

interface HeaderProps {
  user?: User;
  users?: User[];
  onSearch: (query: string, useAI: boolean, filters: SearchFilters) => void;
  onMenuToggle: () => void;
  onSwitchUser?: (userId: number) => void;
}

export function Header({ user, users = [], onSearch, onMenuToggle, onSwitchUser }: HeaderProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleSearch = (query: string, useAI: boolean, filters: SearchFilters) => {
    setIsSearching(true);
    
    // Close mobile search sheet if open
    if (searchOpen) {
      setSearchOpen(false);
    }
    
    // Call parent component's search function
    onSearch(query, useAI, filters);
    
    // Simulate search completion
    setTimeout(() => {
      setIsSearching(false);
    }, 1500);
  };

  const handleSwitchUser = (userId: number) => {
    if (onSwitchUser) {
      onSwitchUser(userId);
    }
  };

  const getUserInitials = (userName: string = '') => {
    if (!userName) return 'U';
    return userName
      .split(' ')
      .map(name => name[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="bg-background border-b border-border px-4 py-2 flex items-center justify-between z-10">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-2">
          <Mail className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold text-primary hidden sm:block">Gugly</h1>
        </div>
      </div>
      
      <div className="hidden md:flex flex-1 max-w-2xl mx-4">
        <VectorSearchBar 
          onSearch={handleSearch} 
          isSearching={isSearching} 
        />
      </div>
      
      <div className="flex items-center space-x-2">
        {isMobile && (
          <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="pt-10 px-4">
              <VectorSearchBar 
                onSearch={handleSearch}
                isSearching={isSearching}
              />
            </SheetContent>
          </Sheet>
        )}
        <ThemeToggle />
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
        
        {users.length > 1 && onSwitchUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 flex items-center gap-2 py-1 px-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-primary text-white text-xs">
                    {user ? getUserInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                {!isMobile && user?.name && (
                  <span className="truncate max-w-[120px]">{user.email}</span>
                )}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {users.map((u) => (
                <DropdownMenuItem 
                  key={u.id} 
                  onClick={() => handleSwitchUser(u.id)}
                  className={`flex items-center gap-2 py-2 ${u.id === user?.id ? 'bg-secondary' : ''}`}
                >
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-primary text-white text-xs">
                      {getUserInitials(u.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{u.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{u.email}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary text-white">
              {user ? getUserInitials(user.name) : 'U'}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </header>
  );
}
