import React, { useState, Suspense } from "react";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { Globe } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { usePerformanceSettings } from "@/hooks/use-performance-settings";
import { ErrorDisplay } from "@/components/ui/error-display";
import { ProxyFrame } from "@/components/ui/proxy-frame";
import { ProxyInfo } from "@/components/ui/proxy-info";
import { ModernSearch } from "@/components/ui/modern-search";
import { Header } from "@/components/layout/header";

interface ProxyResponse {
  html: string;
  status: number;
  headers: Record<string, string | string[] | undefined>;
}

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const { mode } = usePerformanceSettings();

  const {
    data,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery<ProxyResponse>({
    queryKey: url ? ['/api/proxy', url] : [],
    enabled: !!url,
    staleTime: 30000,
    cacheTime: 3600000,
    refetchOnWindowFocus: false
  });

  const handleSubmit = (submittedUrl: string) => {
    setUrl(submittedUrl);
  };

  const handleRefresh = () => {
    if (url) {
      refetch();
    }
  };

  if (mode === 'ps5') {
    const PS5Home = React.lazy(() => import('@/components/ui/ps5-home'));
    return (
      <React.Suspense fallback={<LoadingIndicator />}>
        <PS5Home />
      </React.Suspense>
    );
  }

  return (
    <div>
      <Header onSelectUrl={handleSubmit} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center mb-10">
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