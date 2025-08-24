import { WeatherData, DailyForecast } from '@/lib/store'

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || process.env.WEATHER_API_KEY || 'demo_key_for_github_pages'

export class WeatherService {
  private static instance: WeatherService
  private baseUrl = 'https://api.openweathermap.org/data/2.5'

  private constructor() {}

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService()
    }
    return WeatherService.instance
  }

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    try {
      if (!WEATHER_API_KEY) {
        // Return demo data if no API key
        return {
          temperature: 22,
          condition: 'Clear',
          highTemp: 25,
          lowTemp: 18,
          humidity: 65,
          windSpeed: 5,
          dataSource: 'Demo Data',
          isRealData: false,
          timestamp: new Date(),
        }
      }

      const response = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data')
      }

      const data = await response.json()
      
      return {
        temperature: data.main.temp,
        condition: data.weather[0].main,
        highTemp: data.main.temp_max,
        lowTemp: data.main.temp_min,
        humidity: data.main.humidity,
        windSpeed: data.wind?.speed,
        dataSource: 'OpenWeatherMap',
        isRealData: true,
        timestamp: new Date(),
      }
    } catch (error) {
      console.error('Weather fetch error:', error)
      // Return demo data if API fails
      return {
        temperature: 22,
        condition: 'Clear',
        highTemp: 25,
        lowTemp: 18,
        humidity: 65,
        windSpeed: 5,
        dataSource: 'Demo Data',
        isRealData: false,
        timestamp: new Date(),
      }
    }
  }

  async getForecast(lat: number, lon: number): Promise<DailyForecast[]> {
    try {
      if (!WEATHER_API_KEY) {
        return this.getDemoForecast()
      }

      const response = await fetch(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch forecast data')
      }

      const data = await response.json()
      
      // Group by day and get daily forecast
      const dailyData = this.groupForecastByDay(data.list)
      
      return dailyData.map((day, index) => ({
        id: `forecast-${index}`,
        date: new Date(day.dt * 1000),
        highTemp: day.main.temp_max,
        lowTemp: day.main.temp_min,
        condition: day.weather[0].main,
        precipitation: day.pop * 100, // Convert to percentage
      }))
    } catch (error) {
      console.error('Forecast fetch error:', error)
      // Return demo forecast data
      return this.getDemoForecast()
    }
  }

  private groupForecastByDay(forecastList: any[]): any[] {
    const dailyData: { [key: string]: any } = {}
    
    forecastList.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString()
      if (!dailyData[date]) {
        dailyData[date] = {
          dt: item.dt,
          main: { temp_max: -Infinity, temp_min: Infinity },
          weather: item.weather,
          pop: 0,
          count: 0,
        }
      }
      
      dailyData[date].main.temp_max = Math.max(dailyData[date].main.temp_max, item.main.temp_max)
      dailyData[date].main.temp_min = Math.min(dailyData[date].main.temp_min, item.main.temp_min)
      dailyData[date].pop = Math.max(dailyData[date].pop, item.pop)
      dailyData[date].count++
    })
    
    return Object.values(dailyData).slice(0, 4) // Return 4 days
  }

  private getDemoForecast(): DailyForecast[] {
    const conditions = ['Clear', 'Clouds', 'Rain', 'Sunny']
    const today = new Date()
    
    return Array.from({ length: 4 }, (_, index) => ({
      id: `demo-forecast-${index}`,
      date: new Date(today.getTime() + index * 24 * 60 * 60 * 1000),
      highTemp: 20 + Math.floor(Math.random() * 10),
      lowTemp: 10 + Math.floor(Math.random() * 10),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      precipitation: Math.floor(Math.random() * 30),
    }))
  }

  async getLocationName(lat: number, lon: number): Promise<string> {
    try {
      if (!WEATHER_API_KEY) {
        return 'Demo Location'
      }

      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${WEATHER_API_KEY}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch location name')
      }

      const data = await response.json()
      return data[0]?.name || 'Unknown Location'
    } catch (error) {
      console.error('Location name fetch error:', error)
      return 'Demo Location'
    }
  }
}

export const weatherService = WeatherService.getInstance()
