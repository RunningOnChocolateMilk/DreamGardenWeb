'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Leaf, 
  Droplets, 
  Thermometer,
  Sun,
  Clock,
  Target,
  CheckCircle,
  AlertCircle,
  Info,
  Filter,
  Download
} from 'lucide-react'
import { useDreamGardenStore } from '@/lib/store'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface GrowthData {
  date: string
  height: number
  health: number
  waterLevel: number
}

interface TaskCompletion {
  date: string
  completed: number
  total: number
}

interface PlantPerformance {
  name: string
  growthRate: number
  health: number
  waterEfficiency: number
  tasksCompleted: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function AnalyticsPage() {
  const { beds, plants } = useDreamGardenStore()
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d')
  const [selectedBed, setSelectedBed] = useState<string>('all')
  const [growthData, setGrowthData] = useState<GrowthData[]>([])
  const [taskCompletion, setTaskCompletion] = useState<TaskCompletion[]>([])
  const [plantPerformance, setPlantPerformance] = useState<PlantPerformance[]>([])

  useEffect(() => {
    generateMockData()
  }, [selectedPeriod, selectedBed])

  const generateMockData = () => {
    // Generate growth data
    const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90
    const growth: GrowthData[] = Array.from({ length: days }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (days - i - 1))
      
      return {
        date: date.toISOString().split('T')[0],
        height: Math.round(10 + (i * 0.5) + (Math.random() - 0.5) * 2),
        health: Math.round(70 + (Math.random() - 0.5) * 20),
        waterLevel: Math.round(60 + (Math.random() - 0.5) * 30)
      }
    })
    setGrowthData(growth)

    // Generate task completion data
    const tasks: TaskCompletion[] = Array.from({ length: days }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (days - i - 1))
      
      const total = Math.round(3 + Math.random() * 4)
      const completed = Math.round(total * (0.6 + Math.random() * 0.3))
      
      return {
        date: date.toISOString().split('T')[0],
        completed,
        total
      }
    })
    setTaskCompletion(tasks)

    // Generate plant performance data
    const performance: PlantPerformance[] = plants.map(plant => ({
      name: plant.name,
      growthRate: Math.round(70 + Math.random() * 30),
      health: Math.round(60 + Math.random() * 40),
      waterEfficiency: Math.round(50 + Math.random() * 50),
      tasksCompleted: Math.round(5 + Math.random() * 10)
    }))
    setPlantPerformance(performance)
  }

  const getFilteredBeds = () => {
    if (selectedBed === 'all') return beds
    return beds.filter(bed => bed.id === selectedBed)
  }

  const getFilteredPlants = () => {
    const filteredBeds = getFilteredBeds()
    return plants.filter(plant => 
      filteredBeds.some(bed => bed.id === plant.bedId)
    )
  }

  const calculateGrowthRate = () => {
    if (growthData.length < 2) return 0
    const firstHeight = growthData[0].height
    const lastHeight = growthData[growthData.length - 1].height
    return Math.round(((lastHeight - firstHeight) / firstHeight) * 100)
  }

  const calculateAverageHealth = () => {
    if (growthData.length === 0) return 0
    const sum = growthData.reduce((acc, data) => acc + data.health, 0)
    return Math.round(sum / growthData.length)
  }

  const calculateTaskCompletionRate = () => {
    if (taskCompletion.length === 0) return 0
    const totalCompleted = taskCompletion.reduce((acc, task) => acc + task.completed, 0)
    const totalTasks = taskCompletion.reduce((acc, task) => acc + task.total, 0)
    return Math.round((totalCompleted / totalTasks) * 100)
  }

  const getTopPerformingPlants = () => {
    return plantPerformance
      .sort((a, b) => (b.growthRate + b.health) / 2 - (a.growthRate + a.health) / 2)
      .slice(0, 5)
  }

  const getPlantTypeDistribution = () => {
    const distribution = plants.reduce((acc, plant) => {
      acc[plant.name] = (acc[plant.name] || 0) + 1
      return acc
    }, {} as { [key: string]: number })

    return Object.entries(distribution).map(([name, count]) => ({
      name: name,
      value: count
    }))
  }

  const growthRate = calculateGrowthRate()
  const averageHealth = calculateAverageHealth()
  const taskCompletionRate = calculateTaskCompletionRate()
  const filteredPlants = getFilteredPlants()
  const topPerformingPlants = getTopPerformingPlants()
  const plantTypeDistribution = getPlantTypeDistribution()

  return (
    <div className="min-h-screen bg-dg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-dg-primaryText mb-2">Garden Analytics</h1>
            <p className="text-dg-secondaryText">Track your garden's performance and growth metrics</p>
          </div>
          
          <div className="flex gap-4 mt-4 lg:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dg-primary focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            
            <select
              value={selectedBed}
              onChange={(e) => setSelectedBed(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dg-primary focus:border-transparent"
            >
              <option value="all">All Beds</option>
              {beds.map(bed => (
                <option key={bed.id} value={bed.id}>{bed.name}</option>
              ))}
            </select>
            
            <button className="px-4 py-2 bg-dg-primary text-white rounded-lg hover:bg-dg-primaryDark transition-colors flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dg-cardBackground p-6 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dg-secondaryText text-sm">Growth Rate</p>
                <p className="text-2xl font-bold text-dg-primaryText">{growthRate}%</p>
                <p className="text-xs text-dg-secondaryText">
                  {growthRate > 0 ? 'Growing well' : 'Needs attention'}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                growthRate > 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {growthRate > 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-600" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-600" />
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-dg-cardBackground p-6 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dg-secondaryText text-sm">Average Health</p>
                <p className="text-2xl font-bold text-dg-primaryText">{averageHealth}%</p>
                <p className="text-xs text-dg-secondaryText">
                  {averageHealth > 80 ? 'Excellent' : averageHealth > 60 ? 'Good' : 'Needs care'}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dg-cardBackground p-6 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dg-secondaryText text-sm">Task Completion</p>
                <p className="text-2xl font-bold text-dg-primaryText">{taskCompletionRate}%</p>
                <p className="text-xs text-dg-secondaryText">
                  {taskCompletionRate > 80 ? 'On track' : 'Behind schedule'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-dg-cardBackground p-6 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dg-secondaryText text-sm">Active Plants</p>
                <p className="text-2xl font-bold text-dg-primaryText">{filteredPlants.length}</p>
                <p className="text-xs text-dg-secondaryText">
                  Across {getFilteredBeds().length} beds
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Growth Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-dg-cardBackground p-6 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-dg-primaryText mb-4">Growth Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: any, name: string) => [value, name === 'height' ? 'Height (cm)' : name]}
                />
                <Line 
                  type="monotone" 
                  dataKey="height" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Height"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Health & Water Levels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-dg-cardBackground p-6 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-dg-primaryText mb-4">Health & Water Levels</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: any, name: string) => [value + '%', name === 'health' ? 'Health' : 'Water Level']}
                />
                <Line 
                  type="monotone" 
                  dataKey="health" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Health"
                />
                <Line 
                  type="monotone" 
                  dataKey="waterLevel" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="Water Level"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Task Completion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-dg-cardBackground p-6 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-dg-primaryText mb-4">Task Completion Rate</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskCompletion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: any, name: string) => [value, name === 'completed' ? 'Completed' : 'Total']}
                />
                <Bar dataKey="completed" fill="#10B981" name="Completed" />
                <Bar dataKey="total" fill="#E5E7EB" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Plant Type Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-dg-cardBackground p-6 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-dg-primaryText mb-4">Plant Type Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={plantTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {plantTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Top Performing Plants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-dg-cardBackground p-6 rounded-lg mb-8"
        >
          <h3 className="text-lg font-semibold text-dg-primaryText mb-6">Top Performing Plants</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-dg-secondaryText font-medium">Plant</th>
                  <th className="text-left py-3 text-dg-secondaryText font-medium">Growth Rate</th>
                  <th className="text-left py-3 text-dg-secondaryText font-medium">Health</th>
                  <th className="text-left py-3 text-dg-secondaryText font-medium">Water Efficiency</th>
                  <th className="text-left py-3 text-dg-secondaryText font-medium">Tasks Completed</th>
                  <th className="text-left py-3 text-dg-secondaryText font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {topPerformingPlants.map((plant, index) => (
                  <tr key={plant.name} className="border-b border-gray-100">
                    <td className="py-3 text-dg-primaryText font-medium">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-dg-primary bg-opacity-10 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-bold text-dg-primary">#{index + 1}</span>
                        </div>
                        {plant.name}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${plant.growthRate}%` }}
                          />
                        </div>
                        <span className="text-sm text-dg-secondaryText">{plant.growthRate}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${plant.health}%` }}
                          />
                        </div>
                        <span className="text-sm text-dg-secondaryText">{plant.health}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ width: `${plant.waterEfficiency}%` }}
                          />
                        </div>
                        <span className="text-sm text-dg-secondaryText">{plant.waterEfficiency}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-dg-secondaryText">{plant.tasksCompleted}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        plant.health > 80 
                          ? 'bg-green-100 text-green-800' 
                          : plant.health > 60 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {plant.health > 80 ? 'Excellent' : plant.health > 60 ? 'Good' : 'Needs Care'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-dg-cardBackground p-6 rounded-lg"
        >
          <h3 className="text-lg font-semibold text-dg-primaryText mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2 text-dg-primary" />
            Garden Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-dg-primaryText mb-2">Growth Insights</h4>
              <ul className="space-y-2 text-sm text-dg-secondaryText">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span>Your garden is growing at {growthRate}% rate over the selected period</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span>Average plant health is {averageHealth}% - {averageHealth > 80 ? 'excellent condition' : averageHealth > 60 ? 'good condition' : 'needs attention'}</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span>Task completion rate of {taskCompletionRate}% shows {taskCompletionRate > 80 ? 'consistent care' : 'room for improvement'}</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-dg-primaryText mb-2">Recommendations</h4>
              <ul className="space-y-2 text-sm text-dg-secondaryText">
                {growthRate < 10 && (
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span>Consider adjusting watering schedule to improve growth rate</span>
                  </li>
                )}
                {averageHealth < 70 && (
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span>Some plants may need additional nutrients or care</span>
                  </li>
                )}
                {taskCompletionRate < 80 && (
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span>Try to complete more tasks to maintain garden health</span>
                  </li>
                )}
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span>Continue monitoring weather conditions for optimal care timing</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
