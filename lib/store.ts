import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: 'watering' | 'fertilizing' | 'pruning' | 'planting' | 'general'
  dueDate: Date
  bedId?: string
}

export interface Bed {
  id: string
  name: string
  description: string
  location: string
  size: string
  soilType: string
  createdAt: Date
}

export interface PlantedItem {
  id: string
  name: string
  type: string
  plantedDate: Date
  bedId: string
  health: 'excellent' | 'good' | 'fair' | 'poor'
  notes: string
}

export interface WeatherData {
  temperature: number
  humidity: number
  description: string
  icon: string
  locationName: string
  timestamp: Date
}

interface DreamGardenStore {
  beds: Bed[]
  tasks: Task[]
  plants: PlantedItem[]
  currentWeather: WeatherData | null
  
  addBed: (bed: Omit<Bed, 'id' | 'createdAt'>) => void
  updateBed: (id: string, updates: Partial<Bed>) => void
  deleteBed: (id: string) => void
  
  addTask: (task: Omit<Task, 'id'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  
  addPlant: (plant: Omit<PlantedItem, 'id'>) => void
  updatePlant: (id: string, updates: Partial<PlantedItem>) => void
  deletePlant: (id: string) => void
  
  setCurrentWeather: (weather: WeatherData | null) => void
}

export const useDreamGardenStore = create<DreamGardenStore>()(
  persist(
    (set) => ({
      beds: [],
      tasks: [],
      plants: [],
      currentWeather: null,
      
      addBed: (bedData) => {
        const newBed: Bed = {
          ...bedData,
          id: Date.now().toString(),
          createdAt: new Date(),
        }
        set((state) => ({
          beds: [...state.beds, newBed],
        }))
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
          plants: state.plants.filter((plant) => plant.bedId !== id),
          tasks: state.tasks.filter((task) => task.bedId !== id),
        }))
      },
      
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: Date.now().toString(),
        }
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }))
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
      
      addPlant: (plantData) => {
        const newPlant: PlantedItem = {
          ...plantData,
          id: Date.now().toString(),
        }
        set((state) => ({
          plants: [...state.plants, newPlant],
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
      
      setCurrentWeather: (weather) => {
        set({ currentWeather: weather })
      },
    }),
    {
      name: 'dreamgarden-store',
      partialize: (state) => ({
        beds: state.beds,
        tasks: state.tasks,
        plants: state.plants,
      }),
    }
  )
)
