export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} <span className="font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">MaRi</span>. All rights reserved.</p>
          </div>
          <div className="mt-3 sm:mt-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Fast, secure browsing for students everywhere
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
