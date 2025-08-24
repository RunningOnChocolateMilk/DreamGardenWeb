'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Wind, 
  Thermometer, 
  Droplets, 
  Eye,
  Calendar,
  TrendingUp,
  MapPin,
  RefreshCw,
  AlertCircle,
  Info
} from 'lucide-react'
import { useDreamGardenStore } from '@/lib/store'
import { weatherService } from '@/lib/services/weather'
import toast from 'react-hot-toast'

interface WeatherForecast {
  date: string
  high: number
  low: number
  condition: string
  precipitation: number
  humidity: number
  windSpeed: number
}

interface WeatherHistory {
  date: string
  temperature: number
  condition: string
  precipitation: number
}

const weatherIcons: { [key: string]: any } = {
  'clear': Sun,
  'sunny': Sun,
  'partly-cloudy': Cloud,
  'cloudy': Cloud,
  'rain': CloudRain,
  'snow': CloudSnow,
  'windy': Wind,
  'fog': Eye,
  'storm': CloudRain,
  'drizzle': CloudRain,
}

const getWeatherIcon = (condition: string) => {
  const normalizedCondition = condition.toLowerCase().replace(/\s+/g, '-')
  return weatherIcons[normalizedCondition] || Cloud
}

const getWeatherAdvice = (weather: any, forecast: WeatherForecast[]) => {
  const advice = []
  
  if (weather.temperature < 5) {
    advice.push('Protect sensitive plants from frost')
  }
  
  if (weather.temperature > 30) {
    advice.push('Increase watering frequency for heat-sensitive plants')
  }
  
  if (weather.condition.toLowerCase().includes('rain')) {
    advice.push('Reduce manual watering - nature is helping!')
  }
  
  if (weather.windSpeed > 20) {
    advice.push('Secure tall plants and protect from wind damage')
  }
  
  const upcomingRain = forecast.slice(0, 3).some(day => day.precipitation > 0)
  if (upcomingRain) {
    advice.push('Plan outdoor tasks around upcoming rain')
  }
  
  return advice.length > 0 ? advice : ['Weather conditions are favorable for gardening']
}

export default function WeatherPage() {
  const { currentWeather, locationName, setCurrentWeather } = useDreamGardenStore()
  const [forecast, setForecast] = useState<WeatherForecast[]>([])
  const [weatherHistory, setWeatherHistory] = useState<WeatherHistory[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d')

  useEffect(() => {
    loadWeatherData()
    loadWeatherHistory()
  }, [locationName])

  const loadWeatherData = async () => {
    if (!locationName) return
    
    setLoading(true)
    try {
      // Use mock coordinates for demo
      const weatherData = await weatherService.getCurrentWeather(40.7128, -74.0060) // New York coordinates
      setCurrentWeather(weatherData)
      
      // Generate mock forecast data
      const mockForecast: WeatherForecast[] = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() + i)
        
        return {
          date: date.toISOString().split('T')[0],
          high: Math.round(weatherData.temperature + (Math.random() - 0.5) * 10),
          low: Math.round(weatherData.temperature - 5 - (Math.random() - 0.5) * 5),
          condition: ['clear', 'partly-cloudy', 'cloudy', 'rain'][Math.floor(Math.random() * 4)],
          precipitation: Math.random() > 0.7 ? Math.round(Math.random() * 20) : 0,
          humidity: Math.round(40 + Math.random() * 40),
          windSpeed: Math.round(5 + Math.random() * 15)
        }
      })
      
      setForecast(mockForecast)
    } catch (error) {
      toast.error('Failed to load weather data')
      console.error('Weather loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadWeatherHistory = () => {
    // Generate mock weather history
    const history: WeatherHistory[] = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      return {
        date: date.toISOString().split('T')[0],
        temperature: Math.round(15 + (Math.random() - 0.5) * 20),
        condition: ['clear', 'partly-cloudy', 'cloudy', 'rain'][Math.floor(Math.random() * 4)],
        precipitation: Math.random() > 0.8 ? Math.round(Math.random() * 15) : 0
      }
    }).reverse()
    
    setWeatherHistory(history)
  }

  const getFilteredHistory = () => {
    const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90
    return weatherHistory.slice(-days)
  }

  const getAverageTemperature = (data: WeatherHistory[]) => {
    if (data.length === 0) return 0
    const sum = data.reduce((acc, day) => acc + day.temperature, 0)
    return Math.round(sum / data.length)
  }

  const getTotalPrecipitation = (data: WeatherHistory[]) => {
    return data.reduce((acc, day) => acc + day.precipitation, 0)
  }

  const weatherAdvice = currentWeather ? getWeatherAdvice(currentWeather, forecast) : []

  if (!locationName) {
    return (
      <div className="min-h-screen bg-dg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-dg-secondaryText mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-dg-primaryText mb-2">Location Required</h2>
            <p className="text-dg-secondaryText mb-4">
              Please set your location in settings to view weather information
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-dg-primaryText mb-2">Weather & Garden Planning</h1>
            <p className="text-dg-secondaryText">Monitor weather conditions for optimal garden care</p>
          </div>
          
          <button
            onClick={loadWeatherData}
            disabled={loading}
            className="mt-4 lg:mt-0 flex items-center px-6 py-3 bg-dg-primary text-white rounded-lg hover:bg-dg-primaryDark transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Current Weather */}
        {currentWeather && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8 rounded-lg mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center mb-6 lg:mb-0">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-6">
                  {React.createElement(getWeatherIcon(currentWeather.condition), {
                    className: 'w-12 h-12',
                  })}
                </div>
                <div>
                  <h2 className="text-4xl font-bold mb-2">{currentWeather.temperature}°C</h2>
                  <p className="text-xl opacity-90 capitalize">{currentWeather.condition}</p>
                  <p className="text-sm opacity-75">{locationName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <Droplets className="w-6 h-6 mx-auto mb-2 opacity-75" />
                  <p className="text-sm opacity-75">Humidity</p>
                  <p className="text-xl font-semibold">{currentWeather.humidity}%</p>
                </div>
                <div className="text-center">
                  <Wind className="w-6 h-6 mx-auto mb-2 opacity-75" />
                  <p className="text-sm opacity-75">Wind</p>
                  <p className="text-xl font-semibold">{currentWeather.windSpeed} km/h</p>
                </div>
                <div className="text-center">
                  <Eye className="w-6 h-6 mx-auto mb-2 opacity-75" />
                  <p className="text-sm opacity-75">Visibility</p>
                  <p className="text-xl font-semibold">{currentWeather.visibility || 10} km</p>
                </div>
                <div className="text-center">
                  <Thermometer className="w-6 h-6 mx-auto mb-2 opacity-75" />
                  <p className="text-sm opacity-75">Feels Like</p>
                  <p className="text-xl font-semibold">{currentWeather.feelsLike || currentWeather.temperature}°C</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Weather Advice */}
        {weatherAdvice.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-dg-cardBackground p-6 rounded-lg mb-8"
          >
            <h3 className="text-lg font-semibold text-dg-primaryText mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-dg-primary" />
              Garden Weather Advice
            </h3>
            <div className="space-y-2">
              {weatherAdvice.map((advice, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-dg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                  <p className="text-dg-secondaryText">{advice}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 7-Day Forecast */}
        {forecast.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dg-cardBackground p-6 rounded-lg mb-8"
          >
            <h3 className="text-lg font-semibold text-dg-primaryText mb-6">7-Day Forecast</h3>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {forecast.map((day, index) => (
                <div key={day.date} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-dg-secondaryText mb-2">
                    {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <div className="w-12 h-12 mx-auto mb-3 bg-dg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                    {React.createElement(getWeatherIcon(day.condition), {
                      className: 'w-6 h-6 text-dg-primary',
                    })}
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-dg-primaryText">{day.high}°</p>
                    <p className="text-sm text-dg-secondaryText">{day.low}°</p>
                    {day.precipitation > 0 && (
                      <p className="text-xs text-blue-500">{day.precipitation}mm</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Weather History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dg-cardBackground p-6 rounded-lg mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <h3 className="text-lg font-semibold text-dg-primaryText">Weather History</h3>
            <div className="flex gap-2 mt-4 lg:mt-0">
              {(['7d', '30d', '90d'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === period
                      ? 'bg-dg-primary text-white'
                      : 'bg-gray-100 text-dg-secondaryText hover:bg-gray-200'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Thermometer className="w-8 h-8 text-dg-primary mx-auto mb-2" />
              <p className="text-sm text-dg-secondaryText">Avg Temperature</p>
              <p className="text-2xl font-bold text-dg-primaryText">
                {getAverageTemperature(getFilteredHistory())}°C
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-dg-secondaryText">Total Precipitation</p>
              <p className="text-2xl font-bold text-blue-500">
                {getTotalPrecipitation(getFilteredHistory())}mm
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-dg-secondaryText">Days Tracked</p>
              <p className="text-2xl font-bold text-green-500">
                {getFilteredHistory().length}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-dg-secondaryText font-medium">Date</th>
                  <th className="text-left py-3 text-dg-secondaryText font-medium">Temperature</th>
                  <th className="text-left py-3 text-dg-secondaryText font-medium">Condition</th>
                  <th className="text-left py-3 text-dg-secondaryText font-medium">Precipitation</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredHistory().map((day) => (
                  <tr key={day.date} className="border-b border-gray-100">
                    <td className="py-3 text-dg-primaryText">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="py-3 text-dg-primaryText font-medium">{day.temperature}°C</td>
                    <td className="py-3">
                      <div className="flex items-center">
                        {React.createElement(getWeatherIcon(day.condition), {
                          className: 'w-4 h-4 mr-2 text-dg-secondaryText',
                        })}
                        <span className="text-dg-secondaryText capitalize">{day.condition}</span>
                      </div>
                    </td>
                    <td className="py-3 text-dg-secondaryText">
                      {day.precipitation > 0 ? `${day.precipitation}mm` : '0mm'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Weather Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-dg-cardBackground p-6 rounded-lg"
        >
          <h3 className="text-lg font-semibold text-dg-primaryText mb-4">Weather Gardening Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-dg-primaryText mb-2">Temperature Guidelines</h4>
              <ul className="space-y-1 text-sm text-dg-secondaryText">
                <li>• Below 5°C: Protect frost-sensitive plants</li>
                <li>• 10-20°C: Ideal for most garden activities</li>
                <li>• Above 30°C: Increase watering frequency</li>
                <li>• 15-25°C: Best for seed germination</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-dg-primaryText mb-2">Precipitation Planning</h4>
              <ul className="space-y-1 text-sm text-dg-secondaryText">
                <li>• 0-5mm: Light rain, good for seedlings</li>
                <li>• 5-15mm: Moderate rain, reduce manual watering</li>
                <li>• 15+mm: Heavy rain, avoid outdoor tasks</li>
                <li>• Check forecast before applying fertilizer</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
