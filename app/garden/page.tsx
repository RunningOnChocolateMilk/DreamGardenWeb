'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Leaf, 
  Plus, 
  MapPin, 
  Calendar, 
  Ruler, 
  Edit, 
  Trash2,
  Search
} from 'lucide-react'
import { useDreamGardenStore } from '@/lib/store'
import { toast } from 'react-hot-toast'
import Navigation from '@/components/Navigation'

export default function GardenPage() {
  const { beds, addBed, deleteBed } = useDreamGardenStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredBeds = beds.filter(bed => 
    bed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bed.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddBed = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newBed = {
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      area: parseFloat(formData.get('area') as string),
      description: formData.get('description') as string,
      plantedItems: [],
    }

    addBed(newBed)
    setShowAddForm(false)
    toast.success('Garden bed added successfully!')
  }

  const handleDeleteBed = (id: string) => {
    if (confirm('Are you sure you want to delete this garden bed?')) {
      deleteBed(id)
      toast.success('Garden bed deleted')
    }
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
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-dg-primaryText mb-2">My Garden</h1>
              <p className="text-dg-secondaryText">
                Manage your garden beds and track your plants
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="dg-button-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Bed</span>
            </button>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dg-secondaryText w-5 h-5" />
              <input
                type="text"
                placeholder="Search beds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full dg-input pl-10"
              />
            </div>
          </motion.div>

          {/* Garden Beds */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredBeds.map((bed, index) => (
              <motion.div
                key={bed.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="dg-card p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-dg-primary to-dg-primaryLight rounded-lg flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dg-primaryText">{bed.name}</h3>
                      <p className="text-sm text-dg-secondaryText">{bed.location}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-dg-primary hover:bg-gray-100 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteBed(bed.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Ruler className="w-4 h-4 text-dg-secondaryText" />
                    <span className="text-sm text-dg-secondaryText">
                      Area: {bed.area} m²
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-dg-secondaryText" />
                    <span className="text-sm text-dg-secondaryText">
                      {bed.plantedItems.length} plants
                    </span>
                  </div>

                  {bed.description && (
                    <p className="text-sm text-dg-secondaryText line-clamp-2">
                      {bed.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="w-full dg-button-secondary text-sm">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredBeds.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-dg-primaryText mb-2">
                {searchTerm ? 'No beds found' : 'No garden beds yet'}
              </h3>
              <p className="text-dg-secondaryText mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Create your first garden bed to get started'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="dg-button-primary"
                >
                  Add Your First Bed
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Add Bed Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
          >
            <h2 className="text-2xl font-bold text-dg-primaryText mb-6">Add Garden Bed</h2>
            
            <form onSubmit={handleAddBed} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dg-primaryText mb-2">
                  Bed Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g., Vegetable Garden, Herb Bed"
                  className="w-full dg-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dg-primaryText mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  placeholder="e.g., Backyard, Front Garden"
                  className="w-full dg-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dg-primaryText mb-2">
                  Area (m²)
                </label>
                <input
                  type="number"
                  name="area"
                  required
                  min="0.1"
                  step="0.1"
                  placeholder="e.g., 10.5"
                  className="w-full dg-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dg-primaryText mb-2">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Describe your garden bed..."
                  className="w-full dg-input resize-none"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 border border-gray-300 text-dg-primaryText rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 dg-button-primary"
                >
                  Add Bed
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
