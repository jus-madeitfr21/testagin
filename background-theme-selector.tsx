import { useBackgroundTheme } from "@/hooks/use-background-theme";
import { Button } from "@/components/ui/button";
import { Palette, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function BackgroundThemeSelector() {
  const { theme, setTheme } = useBackgroundTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 flex items-center gap-1 relative group transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Palette className={`h-4 w-4 mr-1 transform transition-all duration-300 ${isHovered ? 'rotate-12 scale-110' : ''}`} />
          <span className="sr-only md:not-sr-only md:inline-block text-sm font-medium">Theme</span>
          <ChevronDown className={`h-3 w-3 ml-1 opacity-70 transition-transform duration-300 ease-out transform ${isHovered ? 'translate-y-0.5 rotate-180' : ''}`} />
          
          {/* Glow effect behind the button */}
          <div className={`absolute inset-0 rounded-md bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 blur-md -z-10 transition-opacity duration-300 ${isHovered ? 'opacity-50' : ''}`}></div>
          
          {/* Color droplets animation */}
          <div className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1 transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-1' : 'opacity-0 -translate-y-2'}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms', animationDuration: '900ms' }}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '300ms', animationDuration: '800ms' }}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-bounce" style={{ animationDelay: '450ms', animationDuration: '950ms' }}></div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 animate-in fade-in-80 zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
        <DropdownMenuLabel className="flex items-center">
          <Palette className="h-4 w-4 mr-2 text-primary" />
          <span>Background Theme</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className={`cursor-pointer transition-colors hover:bg-accent ${theme === "default" ? "bg-muted" : ""}`} 
          onClick={() => setTheme("default")}
        >
          <div className="w-4 h-4 rounded-full bg-background border mr-2"></div>
          <span>Default</span>
          {theme === "default" && (
            <span className="ml-auto text-xs font-semibold bg-primary/20 text-primary px-2 py-0.5 rounded-full">Active</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`cursor-pointer transition-colors hover:bg-accent ${theme === "fazy-blue-purple" ? "bg-muted" : ""}`}
          onClick={() => setTheme("fazy-blue-purple")}
        >
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mr-2"></div>
          <span>Fazy Blue & Purple</span>
          {theme === "fazy-blue-purple" && (
            <span className="ml-auto text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">Active</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`cursor-pointer transition-colors hover:bg-accent ${theme === "black-white-mixed" ? "bg-muted" : ""}`}
          onClick={() => setTheme("black-white-mixed")}
        >
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-black via-gray-500 to-white mr-2"></div>
          <span>Black & White Mixed</span>
          {theme === "black-white-mixed" && (
            <span className="ml-auto text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">Active</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`cursor-pointer transition-colors hover:bg-accent ${theme === "smooth-yellow" ? "bg-muted" : ""}`}
          onClick={() => setTheme("smooth-yellow")}
        >
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-200 to-yellow-600 mr-2"></div>
          <span>Smooth Yellow</span>
          {theme === "smooth-yellow" && (
            <span className="ml-auto text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full">Active</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`cursor-pointer transition-colors hover:bg-accent ${theme === "red-carmal" ? "bg-muted" : ""}`}
          onClick={() => setTheme("red-carmal")}
        >
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-300 to-red-700 mr-2"></div>
          <span>Red Caramel</span>
          {theme === "red-carmal" && (
            <span className="ml-auto text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full">Active</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`cursor-pointer transition-colors hover:bg-accent ${theme === "chocolate-fazy" ? "bg-muted" : ""}`}
          onClick={() => setTheme("chocolate-fazy")}
        >
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-700 to-yellow-600 mr-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-amber-500 opacity-50 animate-pulse"></div>
          </div>
          <span>Chocolate Fazy</span>
          {theme === "chocolate-fazy" && (
            <span className="ml-auto text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">Active</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}