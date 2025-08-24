'use client'

import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Check, 
  Cloud, 
  Leaf, 
  BarChart3, 
  DollarSign, 
  PieChart,
  ArrowRight,
  Calendar,
  Settings
} from 'lucide-react'
import { useDreamGardenStore } from '@/lib/store'
import { toast } from 'react-hot-toast'
import Navigation from '@/components/Navigation'

export default function PremiumPage() {
  const {
    isPremium,
    beds,
    tasks,
    setPremiumStatus,
  } = useDreamGardenStore()

  const handleUpgrade = () => {
    // Simulate premium upgrade
    setPremiumStatus(true)
    toast.success('Welcome to DreamGarden Premium! 🎉')
  }

  const handleRestore = () => {
    // Simulate restore purchases
    setPremiumStatus(true)
    toast.success('Premium access restored!')
  }

  const features = [
    {
      icon: Leaf,
      title: 'Advanced Garden Management',
      description: 'Unlimited garden beds, detailed plant tracking, and growth monitoring',
    },
    {
      icon: Calendar,
      title: 'Enhanced Task Management',
      description: 'Priority-based task scheduling, recurring tasks, and progress tracking',
    },
    {
      icon: Cloud,
      title: 'Extended Weather History',
      description: '12 months of weather data, detailed forecasts, and garden recommendations',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Detailed growth charts, yield predictions, and performance insights',
    },
    {
      icon: DollarSign,
      title: 'Budget Tracking & Analytics',
      description: 'Monitor expenses and track your garden\'s financial performance',
    },
    {
      icon: PieChart,
      title: 'Expense Categorization',
      description: 'Detailed breakdown of costs and potential returns',
    },
    {
      icon: Settings,
      title: 'Custom Settings & Themes',
      description: 'Personalize your experience with custom themes and advanced preferences',
    },
  ]

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
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-dg-primaryText mb-4">
              Unlock Premium Features
            </h1>
            <p className="text-xl text-dg-secondaryText max-w-2xl mx-auto">
              Get advanced garden management, enhanced analytics, and premium tools to transform your garden
            </p>
          </motion.div>

          {/* Current Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="dg-card p-8">
              <h2 className="text-2xl font-bold text-dg-primaryText mb-6 text-center">
                Your Garden Stats
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-dg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-dg-primaryText mb-2">Garden Beds</h3>
                  <p className="text-2xl font-bold text-dg-primary mb-2">
                    {beds.length}
                  </p>
                  <p className="text-sm text-dg-secondaryText">
                    {isPremium ? 'Unlimited' : 'Up to 3 beds'}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-dg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-dg-primaryText mb-2">Active Tasks</h3>
                  <p className="text-2xl font-bold text-dg-secondary mb-2">
                    {tasks.filter(t => !t.completed).length}
                  </p>
                  <p className="text-sm text-dg-secondaryText">
                    {isPremium ? 'Unlimited' : 'Up to 10 tasks'}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-dg-sunlight rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-dg-primaryText mb-2">Completion Rate</h3>
                  <p className="text-2xl font-bold text-dg-sunlight mb-2">
                    {tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%
                  </p>
                  <p className="text-sm text-dg-secondaryText">
                    Task completion
                  </p>
                </div>
              </div>

              {!isPremium && (
                <div className="text-center mt-6">
                  <p className="text-dg-secondaryText text-sm">
                    Free users get basic garden management. Upgrade for unlimited features!
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Premium Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="dg-card p-8">
              <h2 className="text-2xl font-bold text-dg-primaryText mb-8 text-center">
                Premium Features
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-dg-primary to-dg-primaryLight rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dg-primaryText mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-dg-secondaryText">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Purchase Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            {isPremium ? (
              <div className="dg-card p-8 max-w-md mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <Check className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-4">
                  You have Premium Access
                </h2>
                <p className="text-dg-secondaryText mb-6">
                  Enjoy unlimited garden management, advanced analytics, and premium tools!
                </p>
                <button
                  onClick={() => window.open('https://example.com/subscriptions', '_blank')}
                  className="dg-button-secondary"
                >
                  Manage Subscription
                </button>
              </div>
            ) : (
              <div className="dg-card p-8 max-w-lg mx-auto">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-dg-primaryText mb-4">
                    Ready to Transform Your Garden?
                  </h2>
                  <p className="text-dg-secondaryText mb-6">
                    Join thousands of gardeners who are already using advanced tools to grow better gardens
                  </p>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6 rounded-xl mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold">DreamGarden Premium</h3>
                        <p className="text-purple-100">Unlimited garden management & advanced features</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">$9.99</p>
                        <p className="text-purple-100 text-sm">per month</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={handleUpgrade}
                    className="w-full dg-button-primary flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Upgrade to Premium</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={handleRestore}
                    className="w-full dg-button-secondary"
                  >
                    Restore Purchases
                  </button>
                  
                  <p className="text-xs text-dg-secondaryText">
                    Cancel anytime. No commitment required.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
