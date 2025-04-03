import { CheckCircle, Info, Shield, Globe, Zap, Smartphone } from "lucide-react";

export function ProxyInfo() {
  return (
    <div className="mt-10 mb-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-2">
          MaRi Features
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          MaRi provides powerful browsing tools with enhanced privacy and security to protect your online activity
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
          <div className="rounded-full bg-blue-50 dark:bg-blue-900/20 p-3 w-12 h-12 flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="font-semibold text-lg mb-2">Enhanced Privacy</h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Encrypted connections ensure your browsing activity remains private and secure from tracking
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
          <div className="rounded-full bg-indigo-50 dark:bg-indigo-900/20 p-3 w-12 h-12 flex items-center justify-center mb-4">
            <Globe className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h4 className="font-semibold text-lg mb-2">Universal Access</h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Full support for both HTTP and HTTPS websites ensures compatibility with most web content
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
          <div className="rounded-full bg-purple-50 dark:bg-purple-900/20 p-3 w-12 h-12 flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h4 className="font-semibold text-lg mb-2">Optimized Speed</h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Intelligent response caching delivers faster browsing experiences without sacrificing security
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
          <div className="rounded-full bg-pink-50 dark:bg-pink-900/20 p-3 w-12 h-12 flex items-center justify-center mb-4">
            <Smartphone className="h-6 w-6 text-pink-600 dark:text-pink-400" />
          </div>
          <h4 className="font-semibold text-lg mb-2">Responsive Design</h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Fully optimized for all devices, providing a seamless experience on desktop and mobile
          </p>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mt-8">
        <h4 className="font-semibold text-lg mb-4 text-center">MaRi Tips</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Simply type website names like 'example.com' - no need for http://</span>
          </div>
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Blocks school filters including Securly for Chromebooks</span>
          </div>
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Use the refresh button if a site doesn't load correctly</span>
          </div>
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Choose your security mode in settings for enhanced protection</span>
          </div>
        </div>
      </div>
    </div>
  );
}
