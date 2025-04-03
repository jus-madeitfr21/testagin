import { Globe, Shield, Info } from "lucide-react";
import { HistoryPanel } from "@/components/ui/history-panel";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BackgroundThemeSelector } from "@/components/ui/background-theme-selector";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
  onSelectUrl: (url: string) => void;
}

export function Header({ onSelectUrl }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow z-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full opacity-60 group-hover:opacity-100 blur transition duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-full p-1">
                <Globe className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <h1 className="text-2xl font-light ml-2 tracking-tight bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent font-sans">
              MaRiSAS
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => onSelectUrl("https://www.google.com")}>
                    <Globe className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Home Page</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <HistoryPanel onSelectUrl={onSelectUrl} />
            
            <BackgroundThemeSelector />
            
            <ThemeToggle />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Info className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>MaRiSAS.com v1.0</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </header>
  );
}
