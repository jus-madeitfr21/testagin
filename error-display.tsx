import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  message: string;
  onTryAgain: () => void;
}

export function ErrorDisplay({ message, onTryAgain }: ErrorDisplayProps) {
  return (
    <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Proxy Error</h3>
          <div className="mt-2 text-sm text-red-700 dark:text-red-300">
            <p>{message}</p>
          </div>
          <div className="mt-4">
            <Button
              type="button"
              onClick={onTryAgain}
              variant="outline"
              className="rounded-md bg-red-50 dark:bg-red-900/30 px-2 py-1.5 text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
