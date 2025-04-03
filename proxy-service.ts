import axios, { AxiosRequestConfig } from "axios";
import { createProxyMiddleware, fixRequestBody, Options } from "http-proxy-middleware";
import { RequestHandler, Request, Response, NextFunction } from "express";
import NodeCache from "node-cache";
import { IncomingMessage, ServerResponse } from "http";

// Cache with 30 minute TTL for better performance
const cache = new NodeCache({ 
  stdTTL: 1800, // 30 minutes
  checkperiod: 120, // Check for expired keys every 2 minutes
  useClones: false // Don't clone data for performance
});

// Headers to bypass content filters and Securly for Chromebooks
const bypassHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Language': 'en-US,en;q=0.9',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'X-Forwarded-For': '8.8.8.8', // Helps bypass some IP-based filtering
  'X-Real-IP': '8.8.8.8',
  'X-Forwarded-Host': 'google.com', // Makes it appear as legitimate traffic
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'DNT': '1', // Do Not Track, sometimes helps with filtering bypass
  'Sec-Ch-Ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"'
};

// Special handling for sites that need customized approaches
const SPECIAL_SITES = {
  'youtube.com': {
    extraHeaders: {
      'Cookie': 'CONSENT=YES+; VISITOR_INFO1_LIVE=StKfsQgqQB8; YSC=DwKYllHNwuw; PREF=f6=40000000&f7=100',
      'Accept-Encoding': 'gzip, deflate, br',
    },
    timeout: 20000
  },
  'roblox.com': {
    extraHeaders: {
      'Cache-Control': 'max-age=0',
      'Accept-Encoding': 'gzip, deflate, br'
    },
    timeout: 15000
  },
  'discord.com': {
    extraHeaders: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Origin': 'https://discord.com'
    },
    timeout: 15000
  },
  'google.com': {
    extraHeaders: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Cookie': 'CONSENT=YES+; NID=511=SOMEVALUE;'
    },
    timeout: 10000
  }
};

export interface ProxyResponse {
  html: string;
  status: number;
  headers: Record<string, string | string[] | undefined>;
}

const getSpecialSiteConfig = (url: string) => {
  try {
    const hostname = new URL(url).hostname;
    for (const [site, config] of Object.entries(SPECIAL_SITES)) {
      if (hostname.includes(site)) {
        return config;
      }
    }
  } catch (e) {
    console.error('Error parsing URL:', e);
  }
  return null;
};

export const fetchWebContent = async (url: string): Promise<ProxyResponse> => {
  console.log(`Fetching URL: ${url}`);
  
  // Check cache first
  const cacheKey = `proxy:${url}`;
  const cachedResponse = cache.get<ProxyResponse>(cacheKey);
  
  if (cachedResponse) {
    console.log(`Cache hit for ${url}`);
    return cachedResponse;
  }
  
  try {
    // Get special config if it's a special site
    const specialConfig = getSpecialSiteConfig(url);
    
    // Merge special config with default headers if available
    const headers = specialConfig 
      ? { ...bypassHeaders, ...specialConfig.extraHeaders } 
      : bypassHeaders;
    
    const timeout = specialConfig ? specialConfig.timeout : 10000;
    
    const response = await axios.get(url, {
      responseType: 'text',
      maxRedirects: 5,
      timeout,
      headers,
      validateStatus: status => status < 500 // Accept all non-500 responses
    });
    
    // Process HTML to rewrite URLs, etc. if needed
    let html = response.data;
    
    // Simple URL rewriting (more comprehensive rewriting would be needed in production)
    const proxiedResponse: ProxyResponse = {
      html,
      status: response.status,
      headers: response.headers as Record<string, string | string[] | undefined>,
    };
    
    // Don't cache errors
    if (response.status >= 200 && response.status < 300) {
      // Cache the response
      cache.set(cacheKey, proxiedResponse);
    }
    
    return proxiedResponse;
  } catch (error) {
    console.error(`Error fetching URL ${url}:`, error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Request failed with status code ${error.response.status}: ${error.message}`);
      } else if (error.request) {
        throw new Error(`No response received: ${error.message}`);
      }
    }
    throw new Error(`Error fetching URL: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Type definition to satisfy TS
interface ExtendedOptions extends Options {
  onProxyReq?: (proxyReq: any, req: any, res: any) => void;
  onProxyRes?: (proxyRes: any, req: any, res: any) => void;
  onError?: (err: Error, req: any, res: any) => void;
}

export const createProxyHandler = (): RequestHandler => {
  const proxyMiddleware = createProxyMiddleware({
    router: (req: any) => {
      // Extract target URL from query parameters or other sources
      const targetUrl = req.query.url as string;
      if (!targetUrl) {
        throw new Error('Target URL is required');
      }
      console.log(`Proxying to: ${targetUrl}`);
      return targetUrl;
    },
    pathRewrite: (path, req: any) => {
      // Extract the path from the target URL
      try {
        const targetUrl = req.query.url as string;
        const parsedUrl = new URL(targetUrl);
        return parsedUrl.pathname + parsedUrl.search;
      } catch {
        return path;
      }
    },
    changeOrigin: true,
    onProxyReq: (proxyReq: any, req: any, res: any) => {
      // Extract target URL
      const targetUrl = req.query.url as string;
      
      // Get special config if it's a special site
      const specialConfig = getSpecialSiteConfig(targetUrl);
      
      // Apply default headers
      Object.entries(bypassHeaders).forEach(([key, value]) => {
        proxyReq.setHeader(key, value);
      });
      
      // Apply special site headers if needed
      if (specialConfig && specialConfig.extraHeaders) {
        Object.entries(specialConfig.extraHeaders).forEach(([key, value]) => {
          proxyReq.setHeader(key, value);
        });
      }
      
      // Additional anti-filtering techniques
      proxyReq.setHeader('Referer', 'https://google.com/');
      
      // Add random user-agent rotation periodically to avoid detection
      if (Math.random() > 0.7) {
        const userAgents = [
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Safari/605.1.15',
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0'
        ];
        const randomAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
        proxyReq.setHeader('User-Agent', randomAgent);
      }
      
      fixRequestBody(proxyReq, req);
    },
    // Handle responses
    onProxyRes: (proxyRes: any, req: any, res: any) => {
      // Set CORS headers to allow iframe access
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      
      // Add custom X-Proxy headers
      res.setHeader('X-Proxied-By', 'MaRi');
    },
    // Configure error handling
    onError: (err: Error, req: any, res: any) => {
      console.error('Proxy error:', err);
      res.writeHead(500, {
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify({ 
        error: 'Proxy Error', 
        message: err.message,
        status: 500
      }));
    },
    // @ts-ignore - Type issue with logLevel but it works properly
    logLevel: 'silent'
  } as ExtendedOptions);

  return proxyMiddleware;
};
