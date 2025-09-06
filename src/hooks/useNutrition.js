import { useState, useEffect } from 'react'
import { NutritionService } from '../services/nutritionService'
import { useAuth } from './useAuth'

export const useNutrition = () => {
  const { user, userProfile } = useAuth()
  const [foodLogs, setFoodLogs] = useState([])
  const [insights, setInsights] = useState([])
  const [nutritionAnalysis, setNutritionAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load user's data on mount
  useEffect(() => {
    if (user) {
      loadFoodLogs()
      loadInsights()
    }
  }, [user])

  // Recalculate analysis when food logs change
  useEffect(() => {
    if (foodLogs.length > 0) {
      calculateNutritionAnalysis()
    }
  }, [foodLogs, userProfile])

  const loadFoodLogs = async () => {
    try {
      setLoading(true)
      const logs = await NutritionService.getUserFoodLogs(user.id)
      setFoodLogs(logs)
    } catch (err) {
      setError('Failed to load food logs')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadInsights = async () => {
    try {
      const userInsights = await NutritionService.getUserInsights(user.id)
      setInsights(userInsights)
    } catch (err) {
      console.error('Failed to load insights:', err)
    }
  }

  const addFoodLog = async (foodData) => {
    try {
      setLoading(true)
      setError(null)

      const newFoodLog = {
        mealName: foodData.mealName,
        timestamp: foodData.timestamp || new Date(),
        nutritionalInfo: {
          calories: parseInt(foodData.calories) || 0,
          protein: parseInt(foodData.protein) || 0,
          carbs: parseInt(foodData.carbs) || 0,
          fats: parseInt(foodData.fats) || 0
        },
        quantity: foodData.quantity || '1 serving'
      }

      // Save to database if user is authenticated
      if (user) {
        await NutritionService.saveFoodLog(user.id, newFoodLog)
        await loadFoodLogs() // Reload to get the saved log with ID
      } else {
        // Add to local state for non-authenticated users
        const localLog = {
          ...newFoodLog,
          id: Date.now()
        }
        setFoodLogs(prev => [localLog, ...prev])
      }

      return newFoodLog
    } catch (err) {
      setError('Failed to add food log')
      console.error(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteFoodLog = async (logId) => {
    try {
      setLoading(true)
      setError(null)

      // Remove from local state immediately for better UX
      setFoodLogs(prev => prev.filter(log => log.id !== logId))

      // TODO: Implement delete in backend when available
      // await NutritionService.deleteFoodLog(user.id, logId)
    } catch (err) {
      setError('Failed to delete food log')
      console.error(err)
      // Reload logs to restore state if delete failed
      if (user) {
        await loadFoodLogs()
      }
    } finally {
      setLoading(false)
    }
  }

  const updateFoodLog = async (logId, updates) => {
    try {
      setLoading(true)
      setError(null)

      // Update local state immediately
      setFoodLogs(prev => prev.map(log => 
        log.id === logId ? { ...log, ...updates } : log
      ))

      // TODO: Implement update in backend when available
      // await NutritionService.updateFoodLog(user.id, logId, updates)
    } catch (err) {
      setError('Failed to update food log')
      console.error(err)
      // Reload logs to restore state if update failed
      if (user) {
        await loadFoodLogs()
      }
    } finally {
      setLoading(false)
    }
  }

  const generateInsights = async () => {
    try {
      setLoading(true)
      setError(null)

      const userGoals = userProfile?.fitness_goals || 'general health'
      const analysis = await NutritionService.analyzeNutrition(foodLogs, userGoals)
      
      setNutritionAnalysis(analysis)
      
      if (analysis.insights) {
        setInsights(prev => [...analysis.insights, ...prev])
      }

      return analysis
    } catch (err) {
      setError('Failed to generate insights')
      console.error(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const calculateNutritionAnalysis = () => {
    const dailySummary = NutritionService.calculateDailySummary(foodLogs)
    const weeklyTrends = NutritionService.calculateWeeklyTrends(foodLogs)
    
    setNutritionAnalysis({
      dailySummary,
      weeklyTrends,
      recommendations: NutritionService.getNutritionRecommendations(
        userProfile?.fitness_goals,
        dailySummary
      )
    })
  }

  const getDailySummary = (date = null) => {
    const targetDate = date ? new Date(date).toDateString() : new Date().toDateString()
    const dayLogs = foodLogs.filter(log => 
      new Date(log.timestamp).toDateString() === targetDate
    )
    
    return NutritionService.calculateDailySummary(dayLogs)
  }

  const getWeeklyTrends = () => {
    return NutritionService.calculateWeeklyTrends(foodLogs)
  }

  const getNutritionGoals = () => {
    // Basic nutrition goals based on user profile
    const goals = {
      calories: 2000, // Default, should be calculated based on user data
      protein: 150,
      carbs: 250,
      fats: 65
    }

    // Adjust based on fitness goals
    if (userProfile?.fitness_goals) {
      switch (userProfile.fitness_goals.toLowerCase()) {
        case 'weight loss':
          goals.calories = 1500
          goals.protein = 120
          break
        case 'muscle gain':
          goals.calories = 2500
          goals.protein = 200
          break
        case 'maintenance':
        default:
          // Keep defaults
          break
      }
    }

    return goals
  }

  const getProgressTowardsGoals = () => {
    const dailySummary = getDailySummary()
    const goals = getNutritionGoals()
    
    return {
      calories: {
        current: dailySummary.totalCalories,
        goal: goals.calories,
        percentage: Math.round((dailySummary.totalCalories / goals.calories) * 100)
      },
      protein: {
        current: dailySummary.totalProtein,
        goal: goals.protein,
        percentage: Math.round((dailySummary.totalProtein / goals.protein) * 100)
      },
      carbs: {
        current: dailySummary.totalCarbs,
        goal: goals.carbs,
        percentage: Math.round((dailySummary.totalCarbs / goals.carbs) * 100)
      },
      fats: {
        current: dailySummary.totalFats,
        goal: goals.fats,
        percentage: Math.round((dailySummary.totalFats / goals.fats) * 100)
      }
    }
  }

  const clearError = () => setError(null)

  return {
    foodLogs,
    insights,
    nutritionAnalysis,
    loading,
    error,
    addFoodLog,
    deleteFoodLog,
    updateFoodLog,
    generateInsights,
    loadFoodLogs,
    loadInsights,
    getDailySummary,
    getWeeklyTrends,
    getNutritionGoals,
    getProgressTowardsGoals,
    clearError
  }
}
