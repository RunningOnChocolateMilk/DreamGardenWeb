'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Key, 
  Cloud, 
  MapPin, 
  Brain, 
  Bell, 
  Shield, 
  Info,
  Save,
  Eye,
  EyeOff
} from 'lucide-react'
import { useDreamGardenStore } from '@/lib/store'
import { toast } from 'react-hot-toast'
import Navigation from '@/components/Navigation'

export default function SettingsPage() {
  const {
    currentWeather,
    locationName,
    isPremium,
    setPremiumStatus,
  } = useDreamGardenStore()

  const [weatherAPIKey, setWeatherAPIKey] = useState('')
  const [showWeatherKey, setShowWeatherKey] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const handleSaveSettings = () => {
    // In a real app, you'd save these to secure storage
    localStorage.setItem('weather_api_key', weatherAPIKey)
    toast.success('Settings saved successfully!')
  }

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear()
      toast.success('All data cleared')
    }
  }

  const togglePremium = () => {
    setPremiumStatus(!isPremium)
    toast.success(isPremium ? 'Premium disabled' : 'Premium enabled')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dg-background to-dg-background/90">
      <Navigation />
      
      <div className="lg:ml-64">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-dg-primary to-dg-primaryLight rounded-full flex items-center justify-center shadow-lg">
                <Settings className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-dg-primaryText mb-4">Settings</h1>
            <p className="text-dg-secondaryText">
              Configure your garden preferences and notifications
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* API Configuration */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="dg-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Key className="w-6 h-6 text-dg-primary" />
                  <h2 className="text-xl font-semibold text-dg-primaryText">API Configuration</h2>
                </div>

                <div className="space-y-6">
                  {/* Weather API Key */}
                  <div>
                    <label className="block text-sm font-medium text-dg-primaryText mb-2">
                      Weather API Key (OpenWeatherMap)
                    </label>
                    <div className="relative">
                      <input
                        type={showWeatherKey ? 'text' : 'password'}
                        value={weatherAPIKey}
                        onChange={(e) => setWeatherAPIKey(e.target.value)}
                        placeholder="Your OpenWeatherMap API key"
                        className="w-full dg-input pr-12"
                      />
                      <button
                        onClick={() => setShowWeatherKey(!showWeatherKey)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dg-secondaryText hover:text-dg-primary"
                      >
                        {showWeatherKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-dg-secondaryText mt-1">
                      Optional: Get your key from openweathermap.org for real weather data
                    </p>
                  </div>

                  <button
                    onClick={handleSaveSettings}
                    className="w-full dg-button-primary flex items-center justify-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save Settings</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Current Weather */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="dg-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Cloud className="w-6 h-6 text-dg-primary" />
                  <h2 className="text-xl font-semibold text-dg-primaryText">Current Weather</h2>
                </div>

                {currentWeather ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-dg-secondaryText">Location</span>
                      <span className="text-dg-primaryText font-medium">{locationName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-dg-secondaryText">Temperature</span>
                      <span className="text-dg-primaryText font-medium">
                        {Math.round(currentWeather.temperature)}°C
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-dg-secondaryText">Condition</span>
                      <span className="text-dg-primaryText font-medium">{currentWeather.condition}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-dg-secondaryText">Data Source</span>
                      <span className="text-dg-primaryText font-medium">{currentWeather.dataSource}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-dg-secondaryText">No weather data available</p>
                )}
              </div>
            </motion.div>



            {/* Notifications & Premium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="dg-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Bell className="w-6 h-6 text-dg-primary" />
                  <h2 className="text-xl font-semibold text-dg-primaryText">Notifications & Premium</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-dg-primaryText font-medium">Weather Notifications</p>
                      <p className="text-sm text-dg-secondaryText">Get alerts for extreme weather</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationsEnabled}
                        onChange={(e) => setNotificationsEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-dg-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-dg-primaryText font-medium">Premium Status</p>
                      <p className="text-sm text-dg-secondaryText">Enable premium features</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPremium}
                        onChange={togglePremium}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-dg-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <div className="dg-card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-6 h-6 text-red-500" />
                <h2 className="text-xl font-semibold text-dg-primaryText">Data Management</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dg-primaryText font-medium">Clear All Data</p>
                    <p className="text-sm text-dg-secondaryText">Remove all stored data and reset the app</p>
                  </div>
                  <button
                    onClick={handleClearData}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Clear Data
                  </button>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                  <Info className="w-5 h-5 text-blue-500" />
                  <p className="text-sm text-blue-700">
                    Your data is stored locally and never shared with third parties without your consent.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
