import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock, ExternalLink, RefreshCw, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface ProxyHistoryItem {
  url: string;
  timestamp: Date;
  ip: string;
  success?: boolean;
  errorMessage?: string;
}

function formatUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname + urlObj.pathname.substring(0, 15) + (urlObj.pathname.length > 15 ? "..." : "");
  } catch (e) {
    return url.substring(0, 30) + (url.length > 30 ? "..." : "");
  }
}

function getIconForUrl(url: string): JSX.Element {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
    return <div className="w-4 h-4 rounded-full bg-red-500"></div>;
  } else if (lowerUrl.includes("google.com")) {
    return <div className="w-4 h-4 rounded-full bg-blue-500"></div>;
  } else if (lowerUrl.includes("discord.com")) {
    return <div className="w-4 h-4 rounded-full bg-indigo-500"></div>;
  } else if (lowerUrl.includes("gmail.com") || lowerUrl.includes("mail.google.com")) {
    return <div className="w-4 h-4 rounded-full bg-red-400"></div>;
  } else if (lowerUrl.includes("roblox.com")) {
    return <div className="w-4 h-4 rounded-full bg-gray-800"></div>;
  } else {
    return <div className="w-4 h-4 rounded-full bg-gray-400"></div>;
  }
}

interface HistoryPanelProps {
  onSelectUrl: (url: string) => void;
}

export function HistoryPanel({ onSelectUrl }: HistoryPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const {
    data: historyItems,
    isLoading,
    isError,
    refetch,
  } = useQuery<ProxyHistoryItem[]>({
    queryKey: ['/api/history'],
    enabled: isOpen,
    staleTime: 30000, // Only refetch after 30 seconds
  });

  // Filter history based on search term
  const filteredHistory = historyItems 
    ? historyItems.filter(item => 
        item.url.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  // Reset search when reopening the panel
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  // Setup keyboard shortcut (Alt+H) to open history
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'h') {
        setIsOpen(prev => !prev);
        if (!isOpen) {
          refetch();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, refetch]);

  const handleUrlSelect = (url: string) => {
    onSelectUrl(url);
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      refetch();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full" 
          title="Browsing History"
        >
          <Clock className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            <span>Browsing History</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto" 
              title="Refresh" 
              onClick={() => refetch()}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </SheetTitle>
          <SheetDescription>
            View and access your recent browsing activity
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search history..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingIndicator />
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-muted-foreground">
              Error loading history. 
              <Button 
                variant="link" 
                onClick={() => refetch()}
                className="px-1 py-0 h-auto"
              >
                Try again
              </Button>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm 
                ? "No matching history found" 
                : "No browsing history yet"}
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="space-y-1">
                {filteredHistory.map((item, index) => (
                  <div key={index}>
                    <button
                      onClick={() => handleUrlSelect(item.url)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-left",
                        !item.success && "opacity-70"
                      )}
                    >
                      <div className="flex-shrink-0">
                        {getIconForUrl(item.url)}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="text-sm font-medium truncate">
                          {formatUrl(item.url)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.timestamp 
                            ? formatDistanceToNow(new Date(item.timestamp), { addSuffix: true }) 
                            : "Unknown time"}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    </button>
                    {index < filteredHistory.length - 1 && (
                      <Separator className="my-1" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}