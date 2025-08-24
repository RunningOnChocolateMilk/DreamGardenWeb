'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Leaf, 
  Calendar, 
  BarChart3, 
  Sparkles, 
  Cloud, 
  Sun, 
  ChevronRight,
  MapPin,
  Thermometer,
  Droplets,
  Wind
} from 'lucide-react'
import { useDreamGardenStore } from '@/lib/store'
import { weatherService } from '@/lib/services/weather'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

export default function HomePage() {
  const {
    currentWeather,
    forecast,
    locationName,
    isLoadingWeather,
    weatherError,
    beds,
    tasks,
    isPremium,
    setCurrentWeather,
    setForecast,
    setLocationName,
    setWeatherLoading,
    setWeatherError,
  } = useDreamGardenStore()

  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lon: longitude })
          fetchWeatherData(latitude, longitude)
        },
        (error) => {
          console.error('Location error:', error)
          // Use demo location
          fetchWeatherData(-33.8688, 151.2093) // Sydney
        }
      )
    } else {
      // Use demo location
      fetchWeatherData(-33.8688, 151.2093) // Sydney
    }
  }, [])

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      setWeatherLoading(true)
      setWeatherError(null)

      const [weather, forecastData, location] = await Promise.all([
        weatherService.getCurrentWeather(lat, lon),
        weatherService.getForecast(lat, lon),
        weatherService.getLocationName(lat, lon),
      ])

      setCurrentWeather(weather)
      setForecast(forecastData)
      setLocationName(location)
    } catch (error) {
      console.error('Weather fetch error:', error)
      setWeatherError('Failed to load weather data')
      toast.error('Weather data unavailable')
    } finally {
      setWeatherLoading(false)
    }
  }

  const getWeatherIcon = (condition: string) => {
    const lowercased = condition.toLowerCase()
    if (lowercased.includes('clear') || lowercased.includes('sun')) return Sun
    if (lowercased.includes('cloud')) return Cloud
    if (lowercased.includes('rain')) return Droplets
    return Sun
  }

  const quickActions = [
    {
      title: 'My Garden',
      subtitle: 'View & manage',
      icon: Leaf,
      color: 'from-dg-primary to-dg-primaryLight',
      href: '/garden',
    },
    {
      title: 'Tasks',
      subtitle: 'Plan & track',
      icon: Calendar,
      color: 'from-dg-secondary to-dg-secondaryLight',
      href: '/tasks',
    },
    {
      title: 'Analytics',
      subtitle: 'Track progress',
      icon: BarChart3,
      color: 'from-dg-sunlight to-orange-500',
      href: '/analytics',
    },
    {
      title: 'Weather',
      subtitle: 'Forecast & advice',
      icon: Cloud,
      color: 'from-blue-500 to-purple-500',
      href: '/weather',
    },
  ]

  const pendingTasks = tasks.filter(task => !task.completed).slice(0, 3)
  const recentBeds = beds.slice(0, 2)

  return (
    <div className="min-h-screen bg-gradient-to-br from-dg-background to-dg-background/90">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-dg-primary to-dg-primaryLight rounded-full flex items-center justify-center shadow-lg">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <div className="ml-4 text-left">
              <h1 className="text-3xl font-bold text-dg-primary">DreamGarden</h1>
              <p className="text-dg-secondaryText">Your Garden Companion</p>
            </div>
          </div>
        </motion.div>

        {/* Weather Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Link href="/weather" className="block">
            <div className="dg-card p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {currentWeather ? (
                    <>
                      <div className="w-14 h-14 bg-gradient-to-br from-dg-primary to-dg-primaryLight rounded-full flex items-center justify-center">
                        {React.createElement(getWeatherIcon(currentWeather.condition), {
                          className: 'w-7 h-7 text-white',
                        })}
                      </div>
                      <div>
                        <p className="text-dg-secondaryText text-sm">
                          {locationName || 'Current Weather'}
                        </p>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-3xl font-bold text-dg-primary">
                            {Math.round(currentWeather.temperature)}°
                          </span>
                          <span className="text-dg-secondaryText">
                            {currentWeather.condition}
                          </span>
                        </div>
                        {currentWeather.highTemp && currentWeather.lowTemp && (
                          <p className="text-xs text-dg-tertiaryText">
                            H: {Math.round(currentWeather.highTemp)}° L: {Math.round(currentWeather.lowTemp)}°
                          </p>
                        )}
                      </div>
                    </>
                  ) : isLoadingWeather ? (
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gray-200 rounded-full animate-pulse" />
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse mb-2" />
                        <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
                        <Cloud className="w-7 h-7 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-dg-secondaryText">Weather unavailable</p>
                      </div>
                    </div>
                  )}
                </div>
                <ChevronRight className="text-dg-tertiaryText" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={action.href}>
                  <div className="dg-card p-6 text-center hover:shadow-xl transition-all">
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-dg-primaryText mb-1">{action.title}</h3>
                    <p className="text-xs text-dg-secondaryText">{action.subtitle}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Usage Stats */}
        {!isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-6"
          >
            <div className="dg-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-dg-primaryText">Free Usage</h3>
                <Link href="/premium" className="text-dg-primary text-sm font-medium">
                  Upgrade
                </Link>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-dg-secondaryText">Tasks Completed</span>
                    <span className="text-dg-primaryText">{tasks.filter(t => t.completed).length}/{tasks.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-dg-primary h-2 rounded-full transition-all"
                      style={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-dg-secondaryText">Garden Beds</span>
                    <span className="text-dg-primaryText">{beds.length} active</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-dg-secondary h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(beds.length * 20, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}



        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-6"
        >
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-dg-primaryText">Pending Tasks</h3>
                <Link href="/tasks" className="text-dg-primary text-sm">
                  View All
                </Link>
              </div>
              <div className="space-y-2">
                {pendingTasks.map((task) => (
                  <div key={task.id} className="dg-card p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-dg-primaryText">{task.title}</p>
                        <p className="text-xs text-dg-secondaryText">
                          Due {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        task.priority === 'high' ? 'bg-red-100 text-red-600' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {task.priority}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Beds */}
          {recentBeds.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-dg-primaryText">Recent Beds</h3>
                <Link href="/garden" className="text-dg-primary text-sm">
                  View All
                </Link>
              </div>
              <div className="space-y-2">
                {recentBeds.map((bed) => (
                  <div key={bed.id} className="dg-card p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-dg-primaryText">{bed.name}</p>
                        <p className="text-xs text-dg-secondaryText">
                          {bed.plantedItems.length} plants • {bed.location}
                        </p>
                      </div>
                      <Leaf className="w-4 h-4 text-dg-primary" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
