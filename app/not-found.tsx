import Link from 'next/link'
import { Search, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-10 h-10 text-gray-600" />
        </div>
        
        <h1 className="text-6xl font-bold text-dg-primaryText mb-4">404</h1>
        
        <h2 className="text-2xl font-semibold text-dg-primaryText mb-4">
          Page Not Found
        </h2>
        
        <p className="text-dg-secondaryText mb-8">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="space-y-3">
          <Link
            href="/"
            className="w-full flex items-center justify-center px-6 py-3 bg-dg-primary text-white rounded-lg hover:bg-dg-primaryDark transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-dg-primaryText rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-dg-primaryText mb-2">Popular Pages</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/garden"
              className="px-3 py-1 bg-dg-primary bg-opacity-10 text-dg-primary rounded-full text-sm hover:bg-opacity-20 transition-colors"
            >
              Garden
            </Link>
            <Link
              href="/tasks"
              className="px-3 py-1 bg-dg-primary bg-opacity-10 text-dg-primary rounded-full text-sm hover:bg-opacity-20 transition-colors"
            >
              Tasks
            </Link>
            <Link
              href="/weather"
              className="px-3 py-1 bg-dg-primary bg-opacity-10 text-dg-primary rounded-full text-sm hover:bg-opacity-20 transition-colors"
            >
              Weather
            </Link>
            <Link
              href="/analytics"
              className="px-3 py-1 bg-dg-primary bg-opacity-10 text-dg-primary rounded-full text-sm hover:bg-opacity-20 transition-colors"
            >
              Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
