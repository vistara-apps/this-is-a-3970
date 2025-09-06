import React, { useState } from 'react'
import { Plus, Clock, Search, Trash2, Edit } from 'lucide-react'

const FoodLogging = ({ user }) => {
  const [foodLogs, setFoodLogs] = useState([
    {
      id: 1,
      mealName: 'Greek Yogurt with Berries',
      timestamp: new Date('2024-03-20T08:30:00'),
      nutritionalInfo: { calories: 320, protein: 18, carbs: 35, fats: 8 },
      quantity: '1 cup'
    },
    {
      id: 2,
      mealName: 'Quinoa Salad Bowl',
      timestamp: new Date('2024-03-20T12:45:00'),
      nutritionalInfo: { calories: 485, protein: 16, carbs: 68, fats: 18 },
      quantity: '1 bowl'
    }
  ])
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMeal, setNewMeal] = useState({
    mealName: '',
    quantity: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  })

  const handleAddMeal = () => {
    if (newMeal.mealName && newMeal.calories) {
      const meal = {
        id: Date.now(),
        mealName: newMeal.mealName,
        timestamp: new Date(),
        nutritionalInfo: {
          calories: parseInt(newMeal.calories) || 0,
          protein: parseInt(newMeal.protein) || 0,
          carbs: parseInt(newMeal.carbs) || 0,
          fats: parseInt(newMeal.fats) || 0
        },
        quantity: newMeal.quantity || '1 serving'
      }
      
      setFoodLogs([meal, ...foodLogs])
      setNewMeal({
        mealName: '',
        quantity: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: ''
      })
      setShowAddForm(false)
    }
  }

  const handleDeleteMeal = (id) => {
    setFoodLogs(foodLogs.filter(meal => meal.id !== id))
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getTodaysTotal = () => {
    const today = new Date().toDateString()
    const todaysMeals = foodLogs.filter(meal => 
      meal.timestamp.toDateString() === today
    )
    
    return todaysMeals.reduce((total, meal) => ({
      calories: total.calories + meal.nutritionalInfo.calories,
      protein: total.protein + meal.nutritionalInfo.protein,
      carbs: total.carbs + meal.nutritionalInfo.carbs,
      fats: total.fats + meal.nutritionalInfo.fats
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 })
  }

  const todaysTotal = getTodaysTotal()

  if (showAddForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Log New Meal</h1>
          <button
            onClick={() => setShowAddForm(false)}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>

        <div className="card max-w-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meal Name *
              </label>
              <input
                type="text"
                value={newMeal.mealName}
                onChange={(e) => setNewMeal({...newMeal, mealName: e.target.value})}
                className="input"
                placeholder="e.g., Grilled Chicken Salad"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity/Serving Size
              </label>
              <input
                type="text"
                value={newMeal.quantity}
                onChange={(e) => setNewMeal({...newMeal, quantity: e.target.value})}
                className="input"
                placeholder="e.g., 1 cup, 200g, 1 serving"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calories *
                </label>
                <input
                  type="number"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal({...newMeal, calories: e.target.value})}
                  className="input"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Protein (g)
                </label>
                <input
                  type="number"
                  value={newMeal.protein}
                  onChange={(e) => setNewMeal({...newMeal, protein: e.target.value})}
                  className="input"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carbs (g)
                </label>
                <input
                  type="number"
                  value={newMeal.carbs}
                  onChange={(e) => setNewMeal({...newMeal, carbs: e.target.value})}
                  className="input"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fats (g)
                </label>
                <input
                  type="number"
                  value={newMeal.fats}
                  onChange={(e) => setNewMeal({...newMeal, fats: e.target.value})}
                  className="input"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                onClick={handleAddMeal}
                className="btn-primary flex-1"
                disabled={!newMeal.mealName || !newMeal.calories}
              >
                Log Meal
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Food Logging</h1>
          <p className="text-gray-600">Track your meals and monitor your nutrition</p>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Log Meal</span>
        </button>
      </div>

      {/* Today's Summary */}
      <div className="card bg-gradient-to-r from-primary to-blue-600 text-white">
        <h2 className="text-lg font-semibold mb-4">Today's Nutrition Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-blue-100 text-sm">Calories</p>
            <p className="text-2xl font-bold">{todaysTotal.calories}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Protein</p>
            <p className="text-2xl font-bold">{todaysTotal.protein}g</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Carbs</p>
            <p className="text-2xl font-bold">{todaysTotal.carbs}g</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Fats</p>
            <p className="text-2xl font-bold">{todaysTotal.fats}g</p>
          </div>
        </div>
      </div>

      {/* Food Log Entries */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Meals</h2>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search meals..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {foodLogs.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No meals logged yet</h3>
            <p className="text-gray-600 mb-4">Start tracking your nutrition by logging your first meal!</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              Log Your First Meal
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {foodLogs.map((meal) => (
              <div key={meal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="font-medium text-gray-900">{meal.mealName}</h3>
                    <span className="text-sm text-gray-500">{meal.quantity}</span>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(meal.timestamp)} at {formatTime(meal.timestamp)}</span>
                    </span>
                    <span>{meal.nutritionalInfo.calories} cal</span>
                    <span>{meal.nutritionalInfo.protein}g protein</span>
                    <span>{meal.nutritionalInfo.carbs}g carbs</span>
                    <span>{meal.nutritionalInfo.fats}g fats</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-200">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteMeal(meal.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FoodLogging