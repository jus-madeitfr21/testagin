import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { fetchWebContent, createProxyHandler } from "./proxy-service";
import { z } from "zod";

// URL validation schema
const urlSchema = z.object({
  url: z.string().url()
});

export async function registerRoutes(app: Express): Promise<Server> {
  // URL proxy endpoint
  app.get('/api/proxy', async (req: Request, res: Response) => {
    try {
      const url = req.query.url as string;
      
      // Validate URL
      const result = urlSchema.safeParse({ url });
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid URL. Please provide a valid URL with http:// or https:// protocol." 
        });
      }
      
      // Check if this is a preload request
      const isPreloadRequest = req.headers['x-preload-only'] === 'true';
      
      // Only store in history if not a preload request
      if (!isPreloadRequest) {
        await storage.addToHistory({
          url,
          timestamp: new Date(),
          ip: req.ip || 'unknown',
          success: true
        });
      }
      
      // Fetch content
      const proxyResponse = await fetchWebContent(url);
      
      // Return the proxied content
      res.json({
        html: proxyResponse.html,
        status: proxyResponse.status,
        headers: proxyResponse.headers
      });
    } catch (error) {
      console.error('Proxy error:', error);
      
      // Check if this is a preload request
      const isPreloadRequest = req.headers['x-preload-only'] === 'true';
      
      // Only store failed requests in history if not a preload request
      if (!isPreloadRequest && req.query.url) {
        await storage.addToHistory({
          url: req.query.url as string,
          timestamp: new Date(),
          ip: req.ip || 'unknown',
          success: false,
          errorMessage: error instanceof Error ? error.message : "Unknown error"
        });
      }
      
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to proxy the requested website" 
      });
    }
  });
  
  // Direct proxy endpoint (alternative approach using http-proxy-middleware)
  // This can be used if you want to directly proxy requests without returning HTML content
  app.use('/api/direct-proxy', (req, res, next) => {
    // Validate URL
    const url = req.query.url as string;
    if (!url) {
      return res.status(400).json({ message: "URL parameter is required" });
    }
    
    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ message: "Invalid URL format" });
    }
    
    next();
  }, createProxyHandler());
  
  // Get proxy history (for admin/debugging purposes)
  app.get('/api/history', async (req: Request, res: Response) => {
    try {
      const history = await storage.getHistory();
      res.json(history);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to retrieve proxy history" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
