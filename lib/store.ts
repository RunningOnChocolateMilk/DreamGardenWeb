'use client'

import React from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

// Types
export interface WeatherData {
  temperature: number
  condition: string
  highTemp?: number
  lowTemp?: number
  humidity?: number
  windSpeed?: number
  visibility?: number
  feelsLike?: number
  dataSource: string
  isRealData: boolean
  timestamp: Date
}

export interface DailyForecast {
  id: string
  date: Date
  highTemp: number
  lowTemp: number
  condition: string
  precipitation: number
}

export interface GardenBed {
  id: string
  name: string
  location: string
  area: number
  description: string
  plantedItems: PlantedItem[]
  createdAt: Date
}

export interface PlantedItem {
  id: string
  name: string
  type: string
  bedId: string
  plantedDate: Date
  expectedHarvestDate?: Date
  notes: string
}

export interface GardenTask {
  id: string
  title: string
  description: string
  dueDate: Date
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: string
  createdAt: Date
}

export interface BudgetTransaction {
  id: string
  title: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: Date
  notes: string
}

export interface WeatherHistoryEntry {
  id: string
  date: Date
  temperature: number
  condition: string
  highTemp?: number
  lowTemp?: number
  humidity?: number
  windSpeed?: number
  precipitation?: number
  dataSource: string
  isHistorical: boolean
}



// Store
interface DreamGardenStore {
  // Weather
  currentWeather: WeatherData | null
  forecast: DailyForecast[]
  locationName: string
  isLoadingWeather: boolean
  weatherError: string | null
  
  // Garden
  beds: GardenBed[]
  plants: PlantedItem[]
  tasks: GardenTask[]
  budgetTransactions: BudgetTransaction[]
  

  
  // Premium
  isPremium: boolean
  
  // Weather History
  weatherHistory: WeatherHistoryEntry[]
  
  // Actions
  setCurrentWeather: (weather: WeatherData) => void
  setForecast: (forecast: DailyForecast[]) => void
  setLocationName: (name: string) => void
  setWeatherLoading: (loading: boolean) => void
  setWeatherError: (error: string | null) => void
  
  addBed: (bed: Omit<GardenBed, 'id' | 'createdAt'>) => void
  updateBed: (id: string, updates: Partial<GardenBed>) => void
  deleteBed: (id: string) => void
  
  addPlant: (plant: Omit<PlantedItem, 'id'>) => void
  updatePlant: (id: string, updates: Partial<PlantedItem>) => void
  deletePlant: (id: string) => void
  
  addTask: (task: Omit<GardenTask, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<GardenTask>) => void
  deleteTask: (id: string) => void
  toggleTaskComplete: (id: string) => void
  
  addBudgetTransaction: (transaction: Omit<BudgetTransaction, 'id'>) => void
  updateBudgetTransaction: (id: string, updates: Partial<BudgetTransaction>) => void
  deleteBudgetTransaction: (id: string) => void
  
  setPremiumStatus: (isPremium: boolean) => void
  
  addWeatherHistoryEntry: (entry: Omit<WeatherHistoryEntry, 'id'>) => void
  clearWeatherHistory: () => void
}

export const useDreamGardenStore = create<DreamGardenStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentWeather: null,
      forecast: [],
      locationName: '',
      isLoadingWeather: false,
      weatherError: null,
      
      beds: [],
      plants: [],
      tasks: [],
      budgetTransactions: [],
      
      isPremium: false,
      
      weatherHistory: [],
      
      // Weather actions
      setCurrentWeather: (weather) => set({ currentWeather: weather }),
      setForecast: (forecast) => set({ forecast }),
      setLocationName: (name) => set({ locationName: name }),
      setWeatherLoading: (loading) => set({ isLoadingWeather: loading }),
      setWeatherError: (error) => set({ weatherError: error }),
      
      // Garden actions
      addBed: (bedData) => {
        const bed: GardenBed = {
          ...bedData,
          id: uuidv4(),
          createdAt: new Date(),
        }
        set((state) => ({ beds: [...state.beds, bed] }))
      },
      
      updateBed: (id, updates) => {
        set((state) => ({
          beds: state.beds.map((bed) =>
            bed.id === id ? { ...bed, ...updates } : bed
          ),
        }))
      },
      
      deleteBed: (id) => {
        set((state) => ({
          beds: state.beds.filter((bed) => bed.id !== id),
        }))
      },
      
      addPlant: (plantData) => {
        const plant: PlantedItem = {
          ...plantData,
          id: uuidv4(),
        }
        set((state) => ({
          plants: [...state.plants, plant],
        }))
      },
      
      updatePlant: (id, updates) => {
        set((state) => ({
          plants: state.plants.map((plant) =>
            plant.id === id ? { ...plant, ...updates } : plant
          ),
        }))
      },
      
      deletePlant: (id) => {
        set((state) => ({
          plants: state.plants.filter((plant) => plant.id !== id),
        }))
      },
      
      addTask: (taskData) => {
        const task: GardenTask = {
          ...taskData,
          id: uuidv4(),
          createdAt: new Date(),
        }
        set((state) => ({ tasks: [...state.tasks, task] }))
      },
      
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }))
      },
      
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }))
      },
      
      toggleTaskComplete: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        }))
      },
      
      addBudgetTransaction: (transactionData) => {
        const transaction: BudgetTransaction = {
          ...transactionData,
          id: uuidv4(),
        }
        set((state) => ({
          budgetTransactions: [...state.budgetTransactions, transaction],
        }))
      },
      
      updateBudgetTransaction: (id, updates) => {
        set((state) => ({
          budgetTransactions: state.budgetTransactions.map((transaction) =>
            transaction.id === id ? { ...transaction, ...updates } : transaction
          ),
        }))
      },
      
      deleteBudgetTransaction: (id) => {
        set((state) => ({
          budgetTransactions: state.budgetTransactions.filter(
            (transaction) => transaction.id !== id
          ),
        }))
      },
      
      setPremiumStatus: (isPremium) => set({ isPremium }),
      
      addWeatherHistoryEntry: (entryData) => {
        const entry: WeatherHistoryEntry = {
          ...entryData,
          id: uuidv4(),
        }
        set((state) => ({
          weatherHistory: [entry, ...state.weatherHistory],
        }))
      },
      
      clearWeatherHistory: () => set({ weatherHistory: [] }),
    }),
    {
      name: 'dreamgarden-storage',
      partialize: (state) => ({
        beds: state.beds,
        tasks: state.tasks,
        budgetTransactions: state.budgetTransactions,
        isPremium: state.isPremium,
        weatherHistory: state.weatherHistory,
      }),
    }
  )
)

// Store Provider Component
export function StoreProvider({ children }: { children: React.ReactNode }) {
  return children
}
