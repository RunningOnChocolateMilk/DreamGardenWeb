'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Circle, 
  Edit, 
  Trash2, 
  Filter,
  Search,
  AlertCircle,
  Sun,
  Droplets,
  Scissors,
  Sprout
} from 'lucide-react'
import { useDreamGardenStore } from '@/lib/store'
import toast from 'react-hot-toast'

interface Task {
  id: string
  title: string
  description: string
  dueDate: Date
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in-progress' | 'completed'
  category: 'watering' | 'fertilizing' | 'pruning' | 'planting' | 'harvesting' | 'general'
  bedId?: string
  createdAt: Date
}

const taskCategories = [
  { id: 'watering', name: 'Watering', icon: Droplets, color: 'text-blue-500' },
  { id: 'fertilizing', name: 'Fertilizing', icon: Sprout, color: 'text-green-500' },
  { id: 'pruning', name: 'Pruning', icon: Scissors, color: 'text-orange-500' },
  { id: 'planting', name: 'Planting', icon: Sun, color: 'text-yellow-500' },
  { id: 'harvesting', name: 'Harvesting', icon: CheckCircle, color: 'text-purple-500' },
  { id: 'general', name: 'General', icon: AlertCircle, color: 'text-gray-500' },
]

const priorityColors = {
  low: 'text-green-500',
  medium: 'text-yellow-500',
  high: 'text-red-500'
}

export default function TasksPage() {
  const { beds } = useDreamGardenStore()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showAddTask, setShowAddTask] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium' as const,
    category: 'general' as const,
    bedId: ''
  })

  useEffect(() => {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem('dreamgarden-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt)
      })))
    }
  }, [])

  useEffect(() => {
    // Save tasks to localStorage
    localStorage.setItem('dreamgarden-tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    // Filter tasks
    let filtered = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter
      return matchesSearch && matchesStatus && matchesCategory
    })
    
    // Sort by due date and priority
    filtered.sort((a, b) => {
      if (a.status === 'completed' && b.status !== 'completed') return 1
      if (a.status !== 'completed' && b.status === 'completed') return -1
      
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff
      
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })
    
    setFilteredTasks(filtered)
  }, [tasks, searchTerm, statusFilter, categoryFilter])

  const addTask = () => {
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      dueDate: new Date(newTask.dueDate),
      status: 'pending',
      createdAt: new Date()
    }

    setTasks([...tasks, task])
    setNewTask({
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'medium',
      category: 'general',
      bedId: ''
    })
    setShowAddTask(false)
    toast.success('Task added successfully')
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ))
    setEditingTask(null)
    toast.success('Task updated successfully')
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
    toast.success('Task deleted successfully')
  }

  const toggleTaskStatus = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed'
        return { ...task, status: newStatus }
      }
      return task
    }))
  }

  const getOverdueTasks = () => {
    const today = new Date()
    return tasks.filter(task => 
      task.status !== 'completed' && 
      new Date(task.dueDate) < today
    )
  }

  const overdueTasks = getOverdueTasks()

  return (
    <div className="min-h-screen bg-dg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-dg-primaryText mb-2">Garden Tasks</h1>
            <p className="text-dg-secondaryText">Manage your garden maintenance and care tasks</p>
          </div>
          
          <button
            onClick={() => setShowAddTask(true)}
            className="mt-4 lg:mt-0 flex items-center px-6 py-3 bg-dg-primary text-white rounded-lg hover:bg-dg-primaryDark transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Task
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dg-cardBackground p-6 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dg-secondaryText text-sm">Total Tasks</p>
                <p className="text-2xl font-bold text-dg-primaryText">{tasks.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-dg-primary" />
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
                <p className="text-dg-secondaryText text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {tasks.filter(t => t.status === 'pending').length}
                </p>
              </div>
              <Circle className="w-8 h-8 text-yellow-500" />
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
                <p className="text-dg-secondaryText text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-500">
                  {tasks.filter(t => t.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
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
                <p className="text-dg-secondaryText text-sm">Overdue</p>
                <p className="text-2xl font-bold text-red-500">{overdueTasks.length}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-dg-cardBackground p-6 rounded-lg mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dg-secondaryText w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dg-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dg-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dg-primary focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {taskCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-dg-cardBackground p-6 rounded-lg border-l-4 ${
                task.status === 'completed' 
                  ? 'border-green-500 opacity-75' 
                  : new Date(task.dueDate) < new Date() 
                    ? 'border-red-500' 
                    : 'border-dg-primary'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className="flex-shrink-0"
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400 hover:text-dg-primary" />
                      )}
                    </button>
                    
                    <h3 className={`font-semibold ${
                      task.status === 'completed' ? 'line-through text-gray-500' : 'text-dg-primaryText'
                    }`}>
                      {task.title}
                    </h3>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      priorityColors[task.priority]
                    } bg-opacity-10 ${
                      priorityColors[task.priority].replace('text-', 'bg-')
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  {task.description && (
                    <p className={`text-dg-secondaryText mb-3 ${
                      task.status === 'completed' ? 'line-through' : ''
                    }`}>
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-dg-secondaryText">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                    
                    {task.bedId && (
                      <div className="flex items-center gap-1">
                        <span>Bed: {beds.find(b => b.id === task.bedId)?.name || 'Unknown'}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      {(() => {
                        const category = taskCategories.find(c => c.id === task.category)
                        const Icon = category?.icon || AlertCircle
                        return (
                          <>
                            <Icon className={`w-4 h-4 ${category?.color}`} />
                            {category?.name}
                          </>
                        )
                      })()}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setEditingTask(task)}
                    className="p-2 text-dg-secondaryText hover:text-dg-primary hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-dg-secondaryText hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          
          {filteredTasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Calendar className="w-16 h-16 text-dg-secondaryText mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dg-primaryText mb-2">No tasks found</h3>
              <p className="text-dg-secondaryText mb-4">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first garden task to get started'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && categoryFilter === 'all' && (
                <button
                  onClick={() => setShowAddTask(true)}
                  className="px-6 py-3 bg-dg-primary text-white rounded-lg hover:bg-dg-primaryDark transition-colors"
                >
                  Add Your First Task
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold text-dg-primaryText mb-4">Add New Task</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dg-primaryText mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dg-primary focus:border-transparent"
                  placeholder="Task title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dg-primaryText mb-1">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dg-primary focus:border-transparent"
                  rows={3}
                  placeholder="Task description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dg-primaryText mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dg-primary focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dg-primaryText mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dg-primary focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dg-primaryText mb-1">
                    Category
                  </label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dg-primary focus:border-transparent"
                  >
                    {taskCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {beds.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-dg-primaryText mb-1">
                    Garden Bed (Optional)
                  </label>
                  <select
                    value={newTask.bedId}
                    onChange={(e) => setNewTask({ ...newTask, bedId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dg-primary focus:border-transparent"
                  >
                    <option value="">Select a bed</option>
                    {beds.map(bed => (
                      <option key={bed.id} value={bed.id}>{bed.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddTask(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-dg-primaryText rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                className="flex-1 px-4 py-2 bg-dg-primary text-white rounded-lg hover:bg-dg-primaryDark transition-colors"
              >
                Add Task
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold text-dg-primaryText mb-4">Edit Task</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dg-primaryText mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dg-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dg-primaryText mb-1">
                  Description
                </label>
                <textarea
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dg-primary focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dg-primaryText mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={editingTask.dueDate.toISOString().split('T')[0]}
                  onChange={(e) => setEditingTask({ ...editingTask, dueDate: new Date(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dg-primary focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dg-primaryText mb-1">
                    Priority
                  </label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dg-primary focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dg-primaryText mb-1">
                    Category
                  </label>
                  <select
                    value={editingTask.category}
                    onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dg-primary focus:border-transparent"
                  >
                    {taskCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dg-primaryText mb-1">
                    Status
                  </label>
                  <select
                    value={editingTask.status}
                    onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dg-primary focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              
              {beds.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-dg-primaryText mb-1">
                    Garden Bed
                  </label>
                  <select
                    value={editingTask.bedId || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, bedId: e.target.value || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dg-primary focus:border-transparent"
                  >
                    <option value="">Select a bed</option>
                    {beds.map(bed => (
                      <option key={bed.id} value={bed.id}>{bed.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingTask(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-dg-primaryText rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => updateTask(editingTask.id, editingTask)}
                className="flex-1 px-4 py-2 bg-dg-primary text-white rounded-lg hover:bg-dg-primaryDark transition-colors"
              >
                Update Task
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
