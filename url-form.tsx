import { useState } from "react";
import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface URLFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function URLForm({ onSubmit, isLoading }: URLFormProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);
  const [protocol, setProtocol] = useState<"HTTP" | "HTTPS" | null>(null);

  const isValidUrl = (input: string) => {
    try {
      const urlObj = new URL(input);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch (e) {
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    
    if (value) {
      try {
        const urlObj = new URL(value);
        if (urlObj.protocol === "https:") {
          setProtocol("HTTPS");
        } else if (urlObj.protocol === "http:") {
          setProtocol("HTTP");
        } else {
          setProtocol(null);
        }
        setError(!isValidUrl(value));
      } catch (e) {
        setProtocol(null);
        setError(true);
      }
    } else {
      setProtocol(null);
      setError(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidUrl(url)) {
      onSubmit(url);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Link className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={handleInputChange}
            className={`block w-full pl-10 pr-12 py-2 border ${
              error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            } rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 font-mono text-sm`}
            required
          />
          {protocol && (
            <div className="absolute inset-y-0 right-0 flex items-center px-2">
              <span 
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  protocol === "HTTPS" 
                    ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100" 
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                }`}
              >
                {protocol}
              </span>
            </div>
          )}
        </div>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="px-4 py-2 bg-primary-500 text-white rounded-md shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 font-medium transition-colors"
        >
          Browse
        </Button>
      </div>
      {error && (
        <div className="mt-2 text-sm text-red-500">
          Please enter a valid URL including http:// or https://
        </div>
      )}
    </form>
  );
}
