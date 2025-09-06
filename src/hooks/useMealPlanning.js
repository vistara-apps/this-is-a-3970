import { useState, useEffect } from 'react'
import { MealPlanningService } from '../services/mealPlanningService'
import { useAuth } from './useAuth'

export const useMealPlanning = () => {
  const { user, userProfile } = useAuth()
  const [mealPlans, setMealPlans] = useState([])
  const [currentMealPlan, setCurrentMealPlan] = useState(null)
  const [groceryList, setGroceryList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load user's meal plans on mount
  useEffect(() => {
    if (user) {
      loadMealPlans()
    }
  }, [user])

  const loadMealPlans = async () => {
    try {
      setLoading(true)
      const plans = await MealPlanningService.getUserMealPlans(user.id)
      setMealPlans(plans)
      
      // Set the most recent plan as current
      if (plans.length > 0) {
        setCurrentMealPlan(plans[0].meal_plan_data)
      }
    } catch (err) {
      setError('Failed to load meal plans')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const generateMealPlan = async (customPreferences = null) => {
    try {
      setLoading(true)
      setError(null)
      
      const preferences = customPreferences || {
        dietaryPreferences: userProfile?.dietary_preferences || [],
        fitnessGoals: userProfile?.fitness_goals || '',
        allergies: userProfile?.allergies || [],
        preferredCuisines: userProfile?.preferred_cuisines || []
      }

      const newMealPlan = await MealPlanningService.generateWeeklyMealPlan(preferences)
      setCurrentMealPlan(newMealPlan)
      
      // Reload meal plans to include the new one
      if (user) {
        await loadMealPlans()
      }
      
      return newMealPlan
    } catch (err) {
      setError('Failed to generate meal plan')
      console.error(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const generateGroceryList = async (mealPlan = null) => {
    try {
      setLoading(true)
      setError(null)
      
      const planToUse = mealPlan || currentMealPlan
      if (!planToUse) {
        throw new Error('No meal plan available')
      }

      const newGroceryList = await MealPlanningService.generateGroceryList(planToUse)
      setGroceryList(newGroceryList)
      
      return newGroceryList
    } catch (err) {
      setError('Failed to generate grocery list')
      console.error(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const swapMeal = async (day, mealType, preferences = null) => {
    try {
      setLoading(true)
      setError(null)
      
      if (!currentMealPlan) {
        throw new Error('No current meal plan')
      }

      // Generate a new meal plan and extract just the requested meal
      const newPlan = await MealPlanningService.generateWeeklyMealPlan(
        preferences || {
          dietaryPreferences: userProfile?.dietary_preferences || [],
          fitnessGoals: userProfile?.fitness_goals || '',
          allergies: userProfile?.allergies || []
        }
      )

      // Update the current meal plan with the new meal
      const updatedPlan = {
        ...currentMealPlan,
        meals: {
          ...currentMealPlan.meals,
          [day]: {
            ...currentMealPlan.meals[day],
            [mealType]: newPlan.meals[day][mealType]
          }
        }
      }

      setCurrentMealPlan(updatedPlan)
      
      // Save the updated plan if user is authenticated
      if (user) {
        await MealPlanningService.saveMealPlan(user.id, updatedPlan)
        await loadMealPlans()
      }
      
      return updatedPlan
    } catch (err) {
      setError('Failed to swap meal')
      console.error(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const saveMealPlan = async (mealPlan) => {
    try {
      if (!user) {
        throw new Error('User must be logged in to save meal plans')
      }
      
      await MealPlanningService.saveMealPlan(user.id, mealPlan)
      await loadMealPlans()
    } catch (err) {
      setError('Failed to save meal plan')
      console.error(err)
      throw err
    }
  }

  const getMealPlanStats = (mealPlan = null) => {
    const planToAnalyze = mealPlan || currentMealPlan
    if (!planToAnalyze) return null

    const days = Object.keys(planToAnalyze.meals)
    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFats = 0
    let mealCount = 0

    days.forEach(day => {
      const dayMeals = planToAnalyze.meals[day]
      Object.values(dayMeals).forEach(meal => {
        totalCalories += meal.calories || 0
        totalProtein += meal.protein || 0
        totalCarbs += meal.carbs || 0
        totalFats += meal.fats || 0
        mealCount++
      })
    })

    return {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats,
      avgCaloriesPerDay: Math.round(totalCalories / days.length),
      avgProteinPerDay: Math.round(totalProtein / days.length),
      avgCarbsPerDay: Math.round(totalCarbs / days.length),
      avgFatsPerDay: Math.round(totalFats / days.length),
      mealCount,
      daysCount: days.length
    }
  }

  const clearError = () => setError(null)

  return {
    mealPlans,
    currentMealPlan,
    groceryList,
    loading,
    error,
    generateMealPlan,
    generateGroceryList,
    swapMeal,
    saveMealPlan,
    loadMealPlans,
    getMealPlanStats,
    clearError,
    setCurrentMealPlan
  }
}
