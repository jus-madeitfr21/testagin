import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Header } from "@/components/layout/header";
import { useCallback } from "react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, navigate] = useLocation();
  
  const handleSelectUrl = useCallback((url: string) => {
    navigate("/");
  }, [navigate]);
  
  return (
    <div>
      <Header onSelectUrl={handleSelectUrl} />
      
      <div className="min-h-[calc(100vh-140px)] w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">404 Page Not Found</h1>
            </div>

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              The page you're looking for doesn't exist. Please check the URL or go back to the home page.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
