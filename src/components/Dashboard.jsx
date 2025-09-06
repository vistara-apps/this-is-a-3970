import React from 'react'
import { Calendar, Target, TrendingUp, Clock } from 'lucide-react'

const Dashboard = ({ user }) => {
  const todaysStats = {
    calories: { consumed: 1450, target: 2000 },
    protein: { consumed: 85, target: 120 },
    carbs: { consumed: 180, target: 250 },
    fats: { consumed: 65, target: 85 }
  }

  const recentMeals = [
    { name: 'Greek Yogurt with Berries', time: '8:30 AM', calories: 320 },
    { name: 'Quinoa Salad Bowl', time: '12:45 PM', calories: 485 },
    { name: 'Grilled Salmon', time: '7:15 PM', calories: 420 }
  ]

  const ProgressRing = ({ value, max, color, size = 80 }) => {
    const percentage = (value / max) * 100
    const circumference = 2 * Math.PI * 30
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r="30"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r="30"
            stroke={color}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold">{Math.round(percentage)}%</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Welcome back, {user?.name || 'User'}! 👋
        </h1>
        <p className="text-blue-100">
          You're on track to meet your nutrition goals today. Keep it up!
        </p>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Calories</h3>
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div className="flex items-center space-x-4">
            <ProgressRing 
              value={todaysStats.calories.consumed} 
              max={todaysStats.calories.target}
              color="#0891b2"
            />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {todaysStats.calories.consumed}
              </p>
              <p className="text-sm text-gray-500">
                of {todaysStats.calories.target}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Protein</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="flex items-center space-x-4">
            <ProgressRing 
              value={todaysStats.protein.consumed} 
              max={todaysStats.protein.target}
              color="#10b981"
            />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {todaysStats.protein.consumed}g
              </p>
              <p className="text-sm text-gray-500">
                of {todaysStats.protein.target}g
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Carbs</h3>
            <Calendar className="h-5 w-5 text-orange-500" />
          </div>
          <div className="flex items-center space-x-4">
            <ProgressRing 
              value={todaysStats.carbs.consumed} 
              max={todaysStats.carbs.target}
              color="#f97316"
            />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {todaysStats.carbs.consumed}g
              </p>
              <p className="text-sm text-gray-500">
                of {todaysStats.carbs.target}g
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Fats</h3>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </div>
          <div className="flex items-center space-x-4">
            <ProgressRing 
              value={todaysStats.fats.consumed} 
              max={todaysStats.fats.target}
              color="#8b5cf6"
            />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {todaysStats.fats.consumed}g
              </p>
              <p className="text-sm text-gray-500">
                of {todaysStats.fats.target}g
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Meals</h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentMeals.map((meal, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{meal.name}</p>
                  <p className="text-sm text-gray-500">{meal.time}</p>
                </div>
                <span className="text-sm font-semibold text-primary">
                  {meal.calories} cal
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full p-4 text-left bg-primary bg-opacity-10 rounded-lg border border-primary border-opacity-20 hover:bg-opacity-20 transition-colors">
              <h4 className="font-medium text-primary">Generate New Meal Plan</h4>
              <p className="text-sm text-gray-600">Get AI-powered meal suggestions for this week</p>
            </button>
            <button className="w-full p-4 text-left bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors">
              <h4 className="font-medium text-green-700">Log a Meal</h4>
              <p className="text-sm text-gray-600">Quickly add your latest meal or snack</p>
            </button>
            <button className="w-full p-4 text-left bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors">
              <h4 className="font-medium text-orange-700">View Insights</h4>
              <p className="text-sm text-gray-600">See your nutrition trends and recommendations</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard