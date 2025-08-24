'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Leaf, 
  Calendar, 
  BarChart3, 
  Sparkles, 
  Cloud, 
  Settings,
  Menu,
  X,
  Home
} from 'lucide-react'
import { useDreamGardenStore } from '@/lib/store'

const navigationItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Garden', href: '/garden', icon: Leaf },
  { name: 'Tasks', href: '/tasks', icon: Calendar },
  { name: 'Weather', href: '/weather', icon: Cloud },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { isPremium } = useDreamGardenStore()

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-2 bg-dg-cardBackground rounded-lg shadow-lg lg:hidden"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          className="fixed inset-0 z-40 lg:hidden"
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-64 bg-dg-cardBackground shadow-xl">
            <div className="p-6">
              <div className="flex items-center mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-dg-primary to-dg-primaryLight rounded-full flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="ml-3 font-semibold text-dg-primaryText">DreamGarden</span>
              </div>
              
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-dg-primary text-white'
                          : 'text-dg-primaryText hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}

                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        </motion.div>
      )}

      {/* Desktop navigation */}
      <nav className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-dg-cardBackground shadow-xl">
        <div className="p-6">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-dg-primary to-dg-primaryLight rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="font-bold text-dg-primaryText">DreamGarden</h1>
              <p className="text-xs text-dg-secondaryText">Your Garden Companion</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-dg-primary text-white'
                      : 'text-dg-primaryText hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                  
                </Link>
              )
            })}
          </div>

          {/* Premium badge */}
          {isPremium && (
            <div className="mt-8 p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white">
              <div className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                <span className="font-medium">Premium Active</span>
              </div>
              <p className="text-xs opacity-90 mt-1">Unlimited AI features</p>
            </div>
          )}
        </div>
      </nav>

      {/* Main content wrapper */}
      <div className="lg:ml-64">
        {/* Your page content goes here */}
      </div>
    </>
  )
}
