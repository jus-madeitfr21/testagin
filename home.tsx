import { useState } from "react";
import { Globe } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { ErrorDisplay } from "@/components/ui/error-display";
import { ProxyFrame } from "@/components/ui/proxy-frame";
import { ProxyInfo } from "@/components/ui/proxy-info";
import { ModernSearch } from "@/components/ui/modern-search";

interface ProxyResponse {
  html: string;
  status: number;
  headers: Record<string, string | string[] | undefined>;
}

export default function Home() {
  const [url, setUrl] = useState<string>("");
  
  const {
    data,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery<ProxyResponse>({
    queryKey: url ? ['/api/proxy', url] : [],
    enabled: !!url,
  });

  const handleSubmit = (submittedUrl: string) => {
    setUrl(submittedUrl);
  };

  const handleRefresh = () => {
    if (url) {
      refetch();
    }
  };

  return (
    <div>
      {/* Black and White Flowing Background with Inspirational Text */}
      <div className="flowing-background w-full h-[40vh] min-h-[300px] flex flex-col items-center justify-center mb-6">
        <h1 className="inspirational-text mb-2">
          God is the key to LIFE
        </h1>
        <div className="mt-8 z-10">
          <div className="w-24 h-1 mx-auto bg-white opacity-40"></div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">
            Secure Web Proxy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-10 text-center max-w-2xl">
            Browse anonymously with enhanced privacy. Enter a URL or use search engines securely.
          </p>
          
          <ModernSearch onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {isLoading && (
            <div className="p-12 flex justify-center">
              <LoadingIndicator />
            </div>
          )}
          
          {isError && (
            <div className="p-8">
              <ErrorDisplay 
                message={error instanceof Error ? error.message : "An unexpected error occurred"} 
                onTryAgain={handleRefresh} 
              />
            </div>
          )}
          
          {data && !isLoading && !isError && (
            <div className="h-[70vh] min-h-[500px]">
              <ProxyFrame 
                url={url}
                onRefresh={handleRefresh}
                html={data.html}
              />
            </div>
          )}
          
          {!url && !isLoading && !isError && !data && (
            <div className="py-16 flex flex-col items-center justify-center">
              <Globe className="h-24 w-24 text-gray-300 dark:text-gray-600 mb-6" />
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-3">Ready to explore securely</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 text-center max-w-md px-6">
                Search with your preferred engine or enter any website URL. 
                All connections are secured and your browsing activity remains private.
              </p>
            </div>
          )}
        </div>
        
        <ProxyInfo />
      </div>
    </div>
  );
}
