import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { cn } from "./lib/utils";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home-new";
import { usePerformanceSettings } from "@/hooks/use-performance-settings";
import { useBackgroundTheme } from "@/hooks/use-background-theme";
import { Footer } from "@/components/layout/footer";
import { BackgroundThemeProvider } from "@/hooks/use-background-theme";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { mode: performanceMode } = usePerformanceSettings();
  const { theme: bgTheme } = useBackgroundTheme();
  const bgClass = bgTheme === 'default' ? 'bg-background' : `bg-${bgTheme}`;

  return (
    <div className={cn("min-h-screen", bgClass)} data-performance-mode={performanceMode}>
      <main className="flex-grow relative z-10">
        <Router />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BackgroundThemeProvider>
        <AppContent />
      </BackgroundThemeProvider>
    </QueryClientProvider>
  );
}

export default App;