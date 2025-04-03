import { useEffect, useRef, useState } from "react";
import { RefreshCw, Home, ArrowLeft, ExternalLink, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface ProxyFrameProps {
  url: string;
  onRefresh: () => void;
  srcDoc?: string;
  html?: string;
}

// Check if a URL is for a site that needs special handling
const isComplexSite = (url: string): boolean => {
  const specialDomains = [
    'youtube.com', 'youtu.be',
    'gmail.com', 'mail.google.com',
    'discord.com', 'discord.gg',
    'roblox.com'
  ];
  
  try {
    const hostname = new URL(url).hostname;
    return specialDomains.some(domain => hostname.includes(domain));
  } catch (e) {
    return false;
  }
};

export function ProxyFrame({ url, onRefresh, srcDoc, html }: ProxyFrameProps) {
  const [, navigate] = useLocation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [frameHeight, setFrameHeight] = useState('calc(100vh - 220px)');
  const isSpecialSite = isComplexSite(url);

  useEffect(() => {
    // Reset states when URL changes
    setIsLoading(true);
    setLoadError(null);
    
    // Adjust frame height for mobile
    const adjustFrameHeight = () => {
      if (window.innerWidth <= 640) {
        setFrameHeight('calc(100vh - 200px)');
      } else {
        setFrameHeight('calc(100vh - 220px)');
      }
    };
    
    adjustFrameHeight();
    window.addEventListener('resize', adjustFrameHeight);
    
    // Set a timeout to check loading status
    const loadTimeout = setTimeout(() => {
      if (isLoading && isSpecialSite) {
        console.log("Site taking longer to load, still trying...");
        // For complex sites, we'll show a different message but keep trying
      } else if (isLoading) {
        setLoadError("Page is taking too long to load. Try refreshing.");
      }
    }, 10000);
    
    return () => {
      window.removeEventListener('resize', adjustFrameHeight);
      clearTimeout(loadTimeout);
    };
  }, [url, isLoading, isSpecialSite]);

  const goHome = () => {
    navigate("/");
  };

  const goBack = () => {
    // Try browser history first
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback to app home
      navigate("/");
    }
  };
  
  const handleIframeLoad = () => {
    console.log("Iframe loaded");
    setIsLoading(false);
    setLoadError(null);
  };

  const handleIframeError = () => {
    console.log("Iframe error");
    setIsLoading(false);
    setLoadError("Error loading content. The site may not be compatible with the proxy.");
  };
  
  // Enhanced permissions for complex sites
  const getSandboxPermissions = () => {
    let permissions = "allow-same-origin allow-scripts";
    
    if (isSpecialSite) {
      // Add more permissions for complex sites
      permissions += " allow-forms allow-popups allow-modals allow-orientation-lock allow-pointer-lock";
    }
    
    return permissions;
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Button 
              onClick={goBack}
              variant="ghost"
              size="sm"
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Go Back"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
            
            <Button 
              onClick={goHome}
              variant="ghost"
              size="sm"
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Go Home"
            >
              <Home className="h-5 w-5" />
              <span className="sr-only">Home</span>
            </Button>
          </div>
          <span className="font-mono text-sm truncate max-w-md ml-2">{url}</span>
        </div>
        <div className="flex items-center space-x-2">
          {isLoading ? (
            <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300 animate-pulse">
              Loading...
            </span>
          ) : loadError ? (
            <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300">
              Error
            </span>
          ) : (
            <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300">
              Connected
            </span>
          )}
          <Button 
            onClick={onRefresh}
            variant="ghost"
            size="sm"
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            title="Refresh Page"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 inline-flex items-center justify-center"
            title="Open in New Tab"
          >
            <ExternalLink className="h-5 w-5" />
            <span className="sr-only">Open in New Tab</span>
          </a>
        </div>
      </div>
      
      {isSpecialSite && (
        <div className="bg-amber-50 dark:bg-amber-900/20 px-4 py-2 text-amber-800 dark:text-amber-300 text-sm flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>Complex site detected. Some features may be limited in the proxy view.</span>
        </div>
      )}
      
      {loadError && (
        <div className="bg-red-50 dark:bg-red-900/20 px-4 py-2 text-red-800 dark:text-red-300 text-sm flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{loadError}</span>
        </div>
      )}
      
      <div className="relative" style={{ height: frameHeight, minHeight: '400px' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 z-10">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Loading {isSpecialSite ? 'complex site' : 'content'}...</p>
            </div>
          </div>
        )}
        
        <iframe 
          ref={iframeRef}
          className="w-full h-full bg-white"
          sandbox={getSandboxPermissions()}
          srcDoc={srcDoc}
          src={html ? `data:text/html;charset=utf-8,${encodeURIComponent(html)}` : undefined}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        ></iframe>
      </div>
    </div>
  );
}
