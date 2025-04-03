import { useState, useRef, useEffect } from "react";
import { Search, Settings, ChevronDown, Shield, Brain, Sun, Moon, Palette, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaGoogle, FaYahoo, FaYoutube, FaDiscord, FaMicrosoft } from "react-icons/fa";
import { SiRoblox, SiGmail } from "react-icons/si";
import { useTheme } from "@/hooks/use-theme";
import { useBackgroundTheme } from "@/hooks/use-background-theme";
import { usePerformanceSettings } from "@/hooks/use-performance-settings";
import axios from "axios";

interface ModernSearchProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

type SearchEngine = 'google' | 'bing' | 'yahoo';
type QuickApp = 'youtube' | 'roblox' | 'discord' | 'gmail';
type SecurityMode = 'beta-ai' | 'enhanced';

const searchEngineUrls: Record<SearchEngine, string> = {
  google: 'https://www.google.com/search?q=',
  bing: 'https://www.bing.com/search?q=',
  yahoo: 'https://search.yahoo.com/search?p='
};

const quickAppUrls: Record<QuickApp, string> = {
  youtube: 'https://www.youtube.com',
  roblox: 'https://www.roblox.com',
  discord: 'https://discord.com',
  gmail: 'https://mail.google.com'
};

export function ModernSearch({ onSubmit, isLoading }: ModernSearchProps) {
  const [query, setQuery] = useState("");
  const [searchEngine, setSearchEngine] = useState<SearchEngine>("google");
  const [securityMode, setSecurityMode] = useState<SecurityMode>("enhanced");
  const [isExpanded, setIsExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { theme: colorTheme, setTheme: setColorTheme } = useTheme();
  const { theme: bgTheme, setTheme: setBgTheme } = useBackgroundTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // More flexible URL detection for user convenience
      const urlWithProtocol = /^(http|https):\/\/[^ "]+$/.test(query.trim());
      const domainPattern = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
      const hasDotCom = query.trim().includes('.com') || query.trim().includes('.org') || 
                        query.trim().includes('.net') || query.trim().includes('.edu') ||
                        query.trim().includes('.io') || query.trim().includes('.gov') ||
                        query.trim().includes('.me');

      // If it's a URL with protocol, use as is
      if (urlWithProtocol) {
        onSubmit(query.trim());
      } 
      // If it looks like a domain or has .com/.net/etc.
      else if (domainPattern.test(query.trim()) || hasDotCom) {
        // Add https:// prefix if missing
        onSubmit(`https://${query.trim()}`);
      } 
      // Otherwise, treat as a search query
      else {
        onSubmit(`${searchEngineUrls[searchEngine]}${encodeURIComponent(query.trim())}`);
      }
    }
  };

  // Track if app URLs are being preloaded
  const [preloadedApps, setPreloadedApps] = useState<Record<QuickApp, boolean>>({
    youtube: false,
    roblox: false,
    discord: false,
    gmail: false
  });

  // Handle direct click on a quick app button
  const handleQuickAppClick = (app: QuickApp) => {
    console.log("Quick app clicked:", app, "URL:", quickAppUrls[app]);

    // Use direct link opening for complex sites to avoid proxy issues
    if (app === 'discord' || app === 'gmail') {
      window.open(quickAppUrls[app], '_blank');
    } else {
      // Submit through proxy
      onSubmit(quickAppUrls[app]);
    }
  };

  // Open app in a new tab directly (bypassing proxy for complex sites)
  const openInNewTab = (app: QuickApp) => {
    window.open(quickAppUrls[app], '_blank');
  };

  // Preload common apps in background to make subsequent loads faster
  const preloadApp = async (app: QuickApp) => {
    try {
      // Skip if already preloaded
      if (preloadedApps[app]) return;

      console.log(`Preloading ${app}...`);

      // Silently preload the content to warm up the cache
      await axios.get(`/api/proxy?url=${encodeURIComponent(quickAppUrls[app])}`, {
        headers: { 'X-Preload-Only': 'true' }
      });

      // Mark as preloaded
      setPreloadedApps(prev => ({ ...prev, [app]: true }));
      console.log(`${app} preloaded successfully`);
    } catch (error) {
      console.error(`Error preloading ${app}:`, error);
    }
  };

  // Focus the input when component mounts and preload popular sites
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }

    // Preload YouTube first (most commonly used)
    preloadApp('youtube');

    // Stagger other preloads to avoid overwhelming the server
    const timer1 = setTimeout(() => preloadApp('roblox'), 2000);
    const timer2 = setTimeout(() => preloadApp('discord'), 4000);
    const timer3 = setTimeout(() => preloadApp('gmail'), 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Setup keyboard shortcuts for quick app access
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger shortcuts if Alt key is pressed
      if (e.altKey) {
        switch (e.key) {
          case 'y': // Alt+Y for YouTube
            handleQuickAppClick('youtube');
            break;
          case 'r': // Alt+R for Roblox
            handleQuickAppClick('roblox');
            break;
          case 'd': // Alt+D for Discord
            handleQuickAppClick('discord');
            break;
          case 'g': // Alt+G for Gmail
            handleQuickAppClick('gmail');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-3xl transition-all duration-300 ease-in-out"
      >
        <div className={`relative group ${isExpanded ? 'scale-105' : 'scale-100'} transition-all duration-300`}>
          <div 
            className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-500 opacity-20 dark:opacity-30 blur-lg rounded-full -z-10"
            style={{ transform: isExpanded ? 'scale(1.05)' : 'scale(1)' }}
          />

          <div className="flex rounded-full shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-gray-800 bg-white overflow-hidden border border-gray-100 dark:border-gray-700">
            {/* Search Engine Selector */}
            <div className="flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="h-16 w-16 rounded-l-full flex items-center justify-center p-0 border-r border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    {searchEngine === 'google' && <FaGoogle className="h-5 w-5 text-[#4285F4]" />}
                    {searchEngine === 'bing' && <FaMicrosoft className="h-5 w-5 text-[#00809D]" />}
                    {searchEngine === 'yahoo' && <FaYahoo className="h-5 w-5 text-[#6001D2]" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="rounded-lg animate-in fade-in-50 zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
                  <DropdownMenuLabel>Search Engine</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSearchEngine('google')} className="cursor-pointer">
                    <FaGoogle className="h-4 w-4 mr-2 text-[#4285F4]" />
                    <span>Google</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSearchEngine('bing')} className="cursor-pointer">
                    <FaMicrosoft className="h-4 w-4 mr-2 text-[#00809D]" />
                    <span>Bing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSearchEngine('yahoo')} className="cursor-pointer">
                    <FaYahoo className="h-4 w-4 mr-2 text-[#6001D2]" />
                    <span>Yahoo</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Search Input */}
            <div className="flex-grow">
              <Input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsExpanded(true)}
                onBlur={() => setIsExpanded(false)}
                placeholder="Search or enter URL..."
                className="border-0 h-16 text-lg bg-transparent focus:ring-0 rounded-none px-4 placeholder:text-gray-400"
              />
            </div>

            {/* Search Button */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="h-16 px-8 rounded-r-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </form>

      {/* Quick Apps */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <div className="flex flex-col items-center space-y-1 group">
          <div className="relative">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={() => handleQuickAppClick('youtube')}
                    variant="outline"
                    className="h-14 w-14 rounded-full flex items-center justify-center p-0 border-red-100 dark:border-red-900/30 group-hover:border-red-200 dark:group-hover:border-red-700/50 bg-white hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-900/20 shadow-sm"
                  >
                    <FaYoutube className="h-6 w-6 text-red-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>YouTube (Alt+Y)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {preloadedApps.youtube && (
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border border-white dark:border-gray-800" 
                title="Preloaded and ready" />
            )}
            <Button
              onClick={() => openInNewTab('youtube')}
              variant="ghost"
              className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full p-0 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              title="Open in new tab"
            >
              <ExternalLink className="h-3 w-3 text-gray-500 dark:text-gray-400" />
            </Button>
          </div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">YouTube</span>
        </div>

        <div className="flex flex-col items-center space-y-1 group">
          <div className="relative">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={() => handleQuickAppClick('roblox')}
                    variant="outline"
                    className="h-14 w-14 rounded-full flex items-center justify-center p-0 border-gray-100 dark:border-gray-700 group-hover:border-gray-200 dark:group-hover:border-gray-600 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/50 shadow-sm"
                  >
                    <SiRoblox className="h-6 w-6 text-gray-800 dark:text-gray-200" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Roblox (Alt+R)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {preloadedApps.roblox && (
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border border-white dark:border-gray-800" 
                title="Preloaded and ready" />
            )}
            <Button
              onClick={() => openInNewTab('roblox')}
              variant="ghost"
              className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full p-0 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              title="Open in new tab"
            >
              <ExternalLink className="h-3 w-3 text-gray-500 dark:text-gray-400" />
            </Button>
          </div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">Roblox</span>
        </div>

        <div className="flex flex-col items-center space-y-1 group">
          <div className="relative">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={() => handleQuickAppClick('discord')}
                    variant="outline"
                    className="h-14 w-14 rounded-full flex items-center justify-center p-0 border-indigo-100 dark:border-indigo-900/30 group-hover:border-indigo-200 dark:group-hover:border-indigo-700/50 bg-white hover:bg-indigo-50 dark:bg-gray-800 dark:hover:bg-indigo-900/20 shadow-sm"
                  >
                    <FaDiscord className="h-6 w-6 text-indigo-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Discord (Alt+D)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {preloadedApps.discord && (
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border border-white dark:border-gray-800" 
                title="Preloaded and ready" />
            )}
            <Button
              onClick={() => openInNewTab('discord')}
              variant="ghost"
              className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full p-0 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              title="Open in new tab"
            >
              <ExternalLink className="h-3 w-3 text-gray-500 dark:text-gray-400" />
            </Button>
          </div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Discord</span>
        </div>

        <div className="flex flex-col items-center space-y-1 group">
          <div className="relative">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={() => handleQuickAppClick('gmail')}
                    variant="outline"
                    className="h-14 w-14 rounded-full flex items-center justify-center p-0 border-red-100 dark:border-red-900/30 group-hover:border-red-200 dark:group-hover:border-red-700/50 bg-white hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-900/20 shadow-sm"
                  >
                    <SiGmail className="h-6 w-6 text-red-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Gmail (Alt+G)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {preloadedApps.gmail && (
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border border-white dark:border-gray-800" 
                title="Preloaded and ready" />
            )}
            <Button
              onClick={() => openInNewTab('gmail')}
              variant="ghost"
              className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full p-0 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              title="Open in new tab"
            >
              <ExternalLink className="h-3 w-3 text-gray-500 dark:text-gray-400" />
            </Button>
          </div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">Gmail</span>
        </div>
      </div>

      {/* Settings */}
      <div className="mt-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 rounded-full px-4 py-2 text-sm border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm"
            >
              <Settings className="h-3.5 w-3.5 mr-1" />
              <span>Settings</span>
              <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-lg animate-in fade-in-50 zoom-in-95 p-0">
            {/* Tabbed Settings */}
            <div className="flex flex-col">
              <div className="flex border-b border-border">
                <button 
                  className="flex-1 px-3 py-2 text-sm font-medium border-b-2 border-primary text-primary"
                  onClick={() => {}}
                >
                  Settings
                </button>
              </div>

              <div className="p-1 space-y-1">
                {/* Light/Dark Mode - Compact */}
                <div className="flex items-center justify-between px-1.5 py-0.5 rounded-md hover:bg-muted">
                  <div className="flex items-center gap-1.5">
                    {colorTheme === "dark" ? (
                      <Moon className="h-3.5 w-3.5 text-indigo-500" />
                    ) : (
                      <Sun className="h-3.5 w-3.5 text-amber-500" />
                    )}
                    <span className="text-xs">Mode</span>
                  </div>
                  <div className="flex items-center space-x-0.5 bg-muted rounded-full p-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-4 w-4 rounded-full ${colorTheme === "light" ? "bg-white text-amber-600 shadow-sm" : "text-muted-foreground"}`}
                      onClick={() => setColorTheme("light")}
                    >
                      <Sun className="h-2.5 w-2.5" />
                      <span className="sr-only">Light</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-5 w-5 rounded-full ${colorTheme === "dark" ? "bg-gray-800 text-indigo-400 shadow-sm" : "text-muted-foreground"}`}
                      onClick={() => setColorTheme("dark")}
                    >
                      <Moon className="h-3 w-3" />
                      <span className="sr-only">Dark</span>
                    </Button>
                  </div>
                </div>

                {/* Background Theme Selection */}
                <div className="px-2 py-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Background</span>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground capitalize">
                      {bgTheme.replace("-", " ")}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 mt-1">
                    <button 
                      className={`h-6 rounded-md border ${bgTheme === "default" ? "ring-1 ring-primary" : "border-border"}`}
                      onClick={() => setBgTheme("default")}
                      title="Default"
                    >
                      <div className="w-full h-full bg-background rounded-md"></div>
                    </button>
                    <button 
                      className={`h-6 rounded-md border ${bgTheme === "fazy-blue-purple" ? "ring-1 ring-primary" : "border-border"}`}
                      onClick={() => setBgTheme("fazy-blue-purple")}
                      title="Fazy Blue & Purple"
                    >
                      <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-md"></div>
                    </button>
                    <button 
                      className={`h-6 rounded-md border ${bgTheme === "black-white-mixed" ? "ring-1 ring-primary" : "border-border"}`}
                      onClick={() => setBgTheme("black-white-mixed")}
                      title="Black & White Mixed"
                    >
                      <div className="w-full h-full bg-gradient-to-br from-black via-gray-500 to-white rounded-md"></div>
                    </button>
                    <button 
                      className={`h-6 rounded-md border ${bgTheme === "smooth-yellow" ? "ring-1 ring-primary" : "border-border"}`}
                      onClick={() => setTheme("smooth-yellow")}
                      title="Smooth Yellow"
                    >
                      <div className="w-full h-full bg-gradient-to-r from-yellow-200 to-yellow-600 rounded-md"></div>
                    </button>
                    <button 
                      className={`h-6 rounded-md border ${bgTheme === "red-carmal" ? "ring-1 ring-primary" : "border-border"}`}
                      onClick={() => setBgTheme("red-carmal")}
                      title="Red Caramel"
                    >
                      <div className="w-full h-full bg-gradient-to-r from-red-300 to-red-700 rounded-md"></div>
                    </button>
                    <button 
                      className={`h-6 rounded-md border ${bgTheme === "chocolate-fazy" ? "ring-1 ring-primary" : "border-border"}`}
                      onClick={() => setBgTheme("chocolate-fazy")}
                      title="Chocolate Fazy"
                    >
                      <div className="w-full h-full bg-gradient-to-r from-amber-700 to-yellow-600 rounded-md relative overflow-hidden">
                        <div className="absolute inset-0 bg-amber-500 opacity-50 animate-pulse"></div>
                      </div>
                    </button>
                  </div>
                </div>

                <DropdownMenuSeparator className="my-1" />

                {/* Search Engine Compact */}
                <div className="px-2 py-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Home Screen</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-muted rounded-full p-0.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`px-2 py-1 text-xs rounded-full ${usePerformanceSettings.getState().mode === 'ps5' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' : 'text-muted-foreground'}`}
                        onClick={() => usePerformanceSettings.setState({ mode: 'ps5' })}
                      >
                        PS5
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`px-2 py-1 text-xs rounded-full ${usePerformanceSettings.getState().mode !== 'ps5' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-muted-foreground'}`}
                        onClick={() => usePerformanceSettings.setState({ mode: 'default' })}
                      >
                        Default
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="px-2 py-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Search className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Search Engine</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      className={`flex items-center justify-center p-1 rounded-md ${searchEngine === 'google' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'hover:bg-muted'}`}
                      onClick={() => setSearchEngine('google')}
                    >
                      <FaGoogle className="h-4 w-4 text-[#4285F4]" />
                    </button>
                    <button
                      className={`flex items-center justify-center p-1 rounded-md ${searchEngine === 'bing' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'hover:bg-muted'}`}
                      onClick={() => setSearchEngine('bing')}
                    >
                      <FaMicrosoft className="h-4 w-4 text-[#00809D]" />
                    </button>
                    <button
                      className={`flex items-center justify-center p-1 rounded-md ${searchEngine === 'yahoo' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'hover:bg-muted'}`}
                      onClick={() => setSearchEngine('yahoo')}
                    >
                      <FaYahoo className="h-4 w-4 text-[#6001D2]" />
                    </button>
                  </div>
                </div>

                {/* Security Mode - Compact Toggle */}
                <div className="px-2 py-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Security</span>
                    </div>

                    <div className="flex items-center space-x-1 bg-muted rounded-full p-0.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 px-2 py-1 rounded-full text-xs ${securityMode === "enhanced" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "text-muted-foreground"}`}
                        onClick={() => setSecurityMode("enhanced")}
                      >
                        Enhanced
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 px-2 py-1 rounded-full text-xs ${securityMode === "beta-ai" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400" : "text-muted-foreground"}`}
                        onClick={() => setSecurityMode("beta-ai")}
                      >
                        Beta AI
                      </Button>
                    </div>
                  </div>
                </div>

                <DropdownMenuSeparator className="my-1" />

                {/* Status Indicators */}
                <div className="px-2 py-1 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Cookies</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px]">Secure</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Cache</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-[10px]">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-muted-foreground">Quality Mode</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => usePerformanceSettings.getState().setMode('high-quality')}
                        className={`px-1.5 py-0.5 rounded-full text-[10px] transition-colors ${
                          usePerformanceSettings.getState().mode === 'high-quality'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        High Quality
                      </button>
                      <button
                        onClick={() => usePerformanceSettings.getState().setMode('performance')}
                        className={`px-1.5 py-0.5 rounded-full text-[10px] transition-colors ${
                          usePerformanceSettings.getState().mode === 'performance'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        Performance
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}