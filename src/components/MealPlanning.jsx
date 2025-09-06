import React, { useState } from 'react'
import { RefreshCw, ShoppingCart, ChefHat, Clock, Users } from 'lucide-react'

const MealPlanning = ({ user }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(null)
  const [showGroceryList, setShowGroceryList] = useState(false)

  // Mock meal plan data
  const sampleMealPlan = {
    week: 'March 18-24, 2024',
    meals: {
      monday: {
        breakfast: { name: 'Overnight Oats with Berries', calories: 320, protein: 12, time: '10 min' },
        lunch: { name: 'Mediterranean Quinoa Bowl', calories: 485, protein: 18, time: '15 min' },
        dinner: { name: 'Grilled Salmon with Asparagus', calories: 420, protein: 35, time: '25 min' },
        snack: { name: 'Greek Yogurt with Almonds', calories: 180, protein: 15, time: '2 min' }
      },
      tuesday: {
        breakfast: { name: 'Avocado Toast with Eggs', calories: 380, protein: 16, time: '8 min' },
        lunch: { name: 'Chicken Caesar Salad', calories: 450, protein: 32, time: '10 min' },
        dinner: { name: 'Veggie Stir-fry with Tofu', calories: 390, protein: 22, time: '20 min' },
        snack: { name: 'Apple with Peanut Butter', calories: 200, protein: 8, time: '2 min' }
      },
      // Add more days as needed...
    }
  }

  const groceryList = [
    { category: 'Proteins', items: ['Salmon fillets (2 lbs)', 'Chicken breast (1.5 lbs)', 'Tofu (14 oz)', 'Greek yogurt (32 oz)', 'Eggs (dozen)'] },
    { category: 'Vegetables', items: ['Asparagus (1 bunch)', 'Mixed greens (5 oz)', 'Avocados (3)', 'Bell peppers (3)', 'Broccoli (1 head)'] },
    { category: 'Grains & Pantry', items: ['Quinoa (2 cups)', 'Rolled oats (18 oz)', 'Whole grain bread', 'Olive oil', 'Almonds (8 oz)'] },
    { category: 'Fruits', items: ['Mixed berries (12 oz)', 'Apples (4)', 'Lemons (2)', 'Bananas (6)'] }
  ]

  const generateMealPlan = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setCurrentWeek(sampleMealPlan)
    setIsGenerating(false)
  }

  const MealCard = ({ meal, mealType }) => (
    <div className="bg-surface border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-1">{meal.name}</h4>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{meal.time}</span>
            </span>
            <span>{meal.calories} cal</span>
            <span>{meal.protein}g protein</span>
          </div>
        </div>
        <button className="text-primary hover:text-primary-dark text-sm font-medium">
          Swap
        </button>
      </div>
    </div>
  )

  if (showGroceryList) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Grocery List</h1>
            <p className="text-gray-600">For week of {currentWeek?.week}</p>
          </div>
          <button
            onClick={() => setShowGroceryList(false)}
            className="btn-secondary"
          >
            Back to Meal Plan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groceryList.map((category, index) => (
            <div key={index} className="card">
              <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
                {category.category}
              </h3>
              <ul className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button className="btn-primary">
            Export to Shopping App
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Meal Planning</h1>
          <p className="text-gray-600">AI-powered personalized meal plans for your goals</p>
        </div>
        
        <div className="flex space-x-3">
          {currentWeek && (
            <button
              onClick={() => setShowGroceryList(true)}
              className="btn-outline flex items-center space-x-2"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Grocery List</span>
            </button>
          )}
          <button
            onClick={generateMealPlan}
            disabled={isGenerating}
            className="btn-primary flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating...' : 'Generate Plan'}</span>
          </button>
        </div>
      </div>

      {!currentWeek && !isGenerating && (
        <div className="text-center py-12">
          <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Ready to create your meal plan?
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Our AI will generate a personalized weekly meal plan based on your preferences, 
            dietary restrictions, and fitness goals.
          </p>
          <button
            onClick={generateMealPlan}
            className="btn-primary"
          >
            Generate My First Meal Plan
          </button>
        </div>
      )}

      {isGenerating && (
        <div className="text-center py-12">
          <div className="animate-pulse">
            <ChefHat className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Creating your personalized meal plan...
            </h3>
            <p className="text-gray-600">
              This may take a few moments while our AI analyzes your preferences.
            </p>
          </div>
        </div>
      )}

      {currentWeek && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Week of {currentWeek.week}
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>Customized for {user?.name}</span>
              </div>
            </div>

            <div className="space-y-8">
              {Object.entries(currentWeek.meals).map(([day, meals]) => (
                <div key={day} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                    {day}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                        Breakfast
                      </h4>
                      <MealCard meal={meals.breakfast} mealType="breakfast" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                        Lunch
                      </h4>
                      <MealCard meal={meals.lunch} mealType="lunch" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                        Dinner
                      </h4>
                      <MealCard meal={meals.dinner} mealType="dinner" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                        Snack
                      </h4>
                      <MealCard meal={meals.snack} mealType="snack" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MealPlanning