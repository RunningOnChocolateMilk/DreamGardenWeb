import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useDreamGardenStore } from '../lib/store'
import { 
  Flower2, 
  Calendar, 
  Cloud, 
  BarChart3, 
  Settings, 
  Plus,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

export default function Dashboard() {
  const { beds, tasks, plants, addBed, addTask } = useDreamGardenStore()
  const [showAddBed, setShowAddBed] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [newBed, setNewBed] = useState({ name: '', description: '', location: '', size: '', soilType: '' })
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' as const, category: 'general' as const })

  const completedTasks = tasks.filter(t => t.completed).length
  const pendingTasks = tasks.filter(t => !t.completed)

  const handleAddBed = () => {
    if (newBed.name && newBed.location) {
      addBed(newBed)
      setNewBed({ name: '', description: '', location: '', size: '', soilType: '' })
      setShowAddBed(false)
    }
  }

  const handleAddTask = () => {
    if (newTask.title) {
      addTask({
        ...newTask,
        completed: false,
        dueDate: new Date(),
      })
      setNewTask({ title: '', description: '', priority: 'medium', category: 'general' })
      setShowAddTask(false)
    }
  }

  return (
    <>
      <Head>
        <title>DreamGarden - Dashboard</title>
        <meta name="description" content="Your AI-powered garden companion" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-dg-background">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Flower2 className="h-8 w-8 text-dg-primary mr-3" />
                <h1 className="text-2xl font-bold text-dg-primaryText">DreamGarden</h1>
              </div>
              <nav className="flex space-x-8">
                <Link href="/" className="text-dg-primary font-medium">Dashboard</Link>
                <Link href="/garden" className="text-dg-secondaryText hover:text-dg-primary">Garden</Link>
                <Link href="/tasks" className="text-dg-secondaryText hover:text-dg-primary">Tasks</Link>
                <Link href="/weather" className="text-dg-secondaryText hover:text-dg-primary">Weather</Link>
                <Link href="/analytics" className="text-dg-secondaryText hover:text-dg-primary">Analytics</Link>
                <Link href="/settings" className="text-dg-secondaryText hover:text-dg-primary">Settings</Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="dg-card p-6">
              <div className="flex items-center">
                <Flower2 className="h-8 w-8 text-dg-primary mr-3" />
                <div>
                  <p className="text-sm text-dg-secondaryText">Garden Beds</p>
                  <p className="text-2xl font-bold text-dg-primaryText">{beds.length}</p>
                </div>
              </div>
            </div>
            
            <div className="dg-card p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-dg-primary mr-3" />
                <div>
                  <p className="text-sm text-dg-secondaryText">Tasks Completed</p>
                  <p className="text-2xl font-bold text-dg-primaryText">{completedTasks}</p>
                </div>
              </div>
            </div>
            
            <div className="dg-card p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-dg-primary mr-3" />
                <div>
                  <p className="text-sm text-dg-secondaryText">Plants Growing</p>
                  <p className="text-2xl font-bold text-dg-primaryText">{plants.length}</p>
                </div>
              </div>
            </div>
            
            <div className="dg-card p-6">
              <div className="flex items-center">
                <Cloud className="h-8 w-8 text-dg-primary mr-3" />
                <div>
                  <p className="text-sm text-dg-secondaryText">Weather</p>
                  <p className="text-2xl font-bold text-dg-primaryText">72°F</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Garden Beds */}
            <div className="dg-card p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-dg-primaryText">Garden Beds</h2>
                <button
                  onClick={() => setShowAddBed(true)}
                  className="dg-button flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Bed
                </button>
              </div>
              
              {beds.length === 0 ? (
                <p className="text-dg-secondaryText text-center py-8">No garden beds yet. Create your first bed to get started!</p>
              ) : (
                <div className="space-y-3">
                  {beds.slice(0, 3).map((bed) => (
                    <div key={bed.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-dg-primaryText">{bed.name}</h3>
                        <p className="text-sm text-dg-secondaryText">{bed.location}</p>
                      </div>
                      <span className="text-sm text-dg-secondaryText">{bed.size}</span>
                    </div>
                  ))}
                  {beds.length > 3 && (
                    <Link href="/garden" className="text-dg-primary hover:text-dg-secondary text-sm">
                      View all {beds.length} beds →
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Recent Tasks */}
            <div className="dg-card p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-dg-primaryText">Recent Tasks</h2>
                <button
                  onClick={() => setShowAddTask(true)}
                  className="dg-button flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </button>
              </div>
              
              {pendingTasks.length === 0 ? (
                <p className="text-dg-secondaryText text-center py-8">No pending tasks. Great job keeping up!</p>
              ) : (
                <div className="space-y-3">
                  {pendingTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-dg-primaryText">{task.title}</h3>
                        <p className="text-sm text-dg-secondaryText">{task.category}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {task.priority === 'high' && <AlertCircle className="h-4 w-4 text-red-500" />}
                        {task.priority === 'medium' && <Clock className="h-4 w-4 text-yellow-500" />}
                        {task.priority === 'low' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </div>
                    </div>
                  ))}
                  {pendingTasks.length > 3 && (
                    <Link href="/tasks" className="text-dg-primary hover:text-dg-secondary text-sm">
                      View all {pendingTasks.length} tasks →
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Add Bed Modal */}
          {showAddBed && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Add Garden Bed</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Bed name"
                    value={newBed.name}
                    onChange={(e) => setNewBed({...newBed, name: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={newBed.location}
                    onChange={(e) => setNewBed({...newBed, location: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Size (e.g., 4x6 ft)"
                    value={newBed.size}
                    onChange={(e) => setNewBed({...newBed, size: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    placeholder="Description"
                    value={newBed.description}
                    onChange={(e) => setNewBed({...newBed, description: e.target.value})}
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddBed(false)}
                    className="dg-button-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddBed}
                    className="dg-button"
                  >
                    Add Bed
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Task Modal */}
          {showAddTask && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Add Task</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    placeholder="Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({...newTask, category: e.target.value as any})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="general">General</option>
                    <option value="watering">Watering</option>
                    <option value="fertilizing">Fertilizing</option>
                    <option value="pruning">Pruning</option>
                    <option value="planting">Planting</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddTask(false)}
                    className="dg-button-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddTask}
                    className="dg-button"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
