
MaRiSAS.com Web Proxy
A dynamic web proxy service that provides intelligent, user-friendly browsing experiences with enhanced performance and engagement.

Features
Multi-platform support (YouTube, Roblox, Discord, Gmail)
Advanced caching and preloading mechanisms
Optimized performance with quick app access
Modern, visually interactive user interface
Intelligent browsing options with visual toggles
Enhanced keyboard navigation and shortcut support
Persistent browsing history stored in PostgreSQL database
Local Development
# Install dependencies
npm install
# Run database migrations
npm run db:push
# Start the development server
npm run dev
Deployment on Render
This application is configured for one-click deployment on Render.

Fork this repository to your GitHub account
Sign up for a Render account at https://render.com
Connect your GitHub account to Render
Click the "New +" button and select "Blueprint"
Select this repository
Render will automatically detect the configuration in render.yaml
Click "Apply" to deploy the application and database
The deployment will create:

A PostgreSQL database
A web service running the MaRiSAS.com proxy
Environment Variables
The following environment variables are configured automatically:

NODE_ENV: Set to "production" for deployment
DATABASE_URL: Connection string for the PostgreSQL database
PORT: The port on which the application runs
License
MIT
